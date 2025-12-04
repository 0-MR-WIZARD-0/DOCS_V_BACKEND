import { Controller, Post, Body, Res, Get, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import * as bcrypt from 'bcrypt';
import { AdminService } from 'src/admin/admin.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
   constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const admin = await this.adminService.findByUsername(body.username);
    if (!admin) throw new UnauthorizedException('Неверные учетные данные');

    const isMatch = await bcrypt.compare(body.password, admin.password);
    if (!isMatch) throw new UnauthorizedException('Неверные учетные данные');

    const token = this.jwtService.sign({ id: admin.id });
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Успешно' };
  
}

  @Get('check')
  check(@Req() req: Request) {
    const token = req.cookies?.token;
    if (!token) return { authorized: false };

    try {
      const data = this.authService.verifyToken(token);
      return { authorized: true, user: data };
    } catch {
      return { authorized: false };
    }
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return { message: 'Выход выполнен' };
  }
}