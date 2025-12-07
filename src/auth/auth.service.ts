import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateAdmin(login: string, password: string) {
    if (login === process.env.ADMIN_LOGIN && password === process.env.ADMIN_PASSWORD) {
      const token = this.jwtService.sign({ login });
      return { token };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Token is invalid');
    }
  }
}
