import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): true {
    const request = context.switchToHttp().getRequest<Request>();
    const xApiKey = request.headers['x-api-key'];

    if (!xApiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    if (xApiKey !== process.env.SECRET_API_KEY) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
