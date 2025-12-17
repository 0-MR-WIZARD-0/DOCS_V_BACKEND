import { Controller, Post, Body, Res, Get, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { AdminService } from 'src/admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const admin = await this.adminService.findByUsername(body.username);
    if (!admin) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(body.password, admin.password);
    if (!isMatch) throw new UnauthorizedException();

    const token = this.jwtService.sign({ id: admin.id });

    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === "production",
      maxAge: 12 * 60 * 60 * 1000,
      path: '/'
    });

    return {
      user: { id: admin.id, username: admin.username },
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Req() req: any) {
    return {
      user: req.user,
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { success: true };
  }
}
