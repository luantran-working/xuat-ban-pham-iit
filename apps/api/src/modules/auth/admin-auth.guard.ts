import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Thiếu thông tin xác thực quản trị.');
    }

    const token = authorization.replace('Bearer ', '').trim();

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET ?? 'iit-publications-secret',
      });

      request['adminUser'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Phiên đăng nhập quản trị không hợp lệ.');
    }
  }
}
