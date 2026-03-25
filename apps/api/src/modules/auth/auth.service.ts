import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminLoginDto } from './dto/admin-login.dto';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'iit@123';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(dto: AdminLoginDto) {
    if (dto.username !== ADMIN_USERNAME || dto.password !== ADMIN_PASSWORD) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng.');
    }

    const accessToken = await this.jwtService.signAsync(
      {
        sub: ADMIN_USERNAME,
        role: 'admin',
      },
      {
        secret: process.env.JWT_SECRET ?? 'iit-publications-secret',
        expiresIn: '12h',
      },
    );

    return {
      username: ADMIN_USERNAME,
      accessToken,
    };
  }
}
