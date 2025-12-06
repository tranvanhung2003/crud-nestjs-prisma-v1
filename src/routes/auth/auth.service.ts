import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  CustomUnprocessableEntityException,
  isPrismaClientKnownRequestError,
  isPrismaClientNotFoundError,
  isPrismaClientUniqueConstraintError,
} from 'src/shared/helpers/helpers';
import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { TokenService } from 'src/shared/services/token.service';
import { EncodedPayload } from 'src/shared/types/jwt.type';
import {
  LoginBodyDto,
  RefreshTokenBodyDto,
  RegisterBodyDto,
  RegisterResponseDto,
} from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async register(body: RegisterBodyDto) {
    try {
      const hashedPassword = await this.hashingService.hash(body.password);
      const user = await this.prisma.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          name: body.name,
        },
      });

      return new RegisterResponseDto(user);
    } catch (error) {
      if (isPrismaClientKnownRequestError(error)) {
        if (isPrismaClientUniqueConstraintError(error)) {
          throw new ConflictException('Email already exists');
        }
      }

      throw new InternalServerErrorException('Lỗi máy chủ nội bộ');
    }
  }

  async login(body: LoginBodyDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      throw new UnauthorizedException('Account does not exist');
    }

    const isPasswordValid = await this.hashingService.compare(
      body.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new CustomUnprocessableEntityException([
        {
          field: 'password',
          error: 'Password is incorrect',
        },
      ]);
    }

    const tokens = await this.generateTokens({ userId: user.id });

    return tokens;
  }

  async generateTokens(payload: EncodedPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload),
    ]);
    const decodedRefreshToken =
      await this.tokenService.verifyRefreshToken(refreshToken);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: new Date(decodedRefreshToken.exp * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(body: RefreshTokenBodyDto) {
    try {
      const { refreshToken } = body;

      // Kiểm tra refreshToken có hợp lệ không
      const { userId } =
        await this.tokenService.verifyRefreshToken(refreshToken);

      // Kiểm tra refreshToken có tồn tại trong database không
      await this.prisma.refreshToken.findUniqueOrThrow({
        where: { token: refreshToken },
      });

      // Xóa refreshToken cũ
      await this.prisma.refreshToken.delete({
        where: { token: refreshToken },
      });

      // Tạo mới cặp accessToken và refreshToken
      return await this.generateTokens({ userId });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (isPrismaClientNotFoundError(error)) {
          throw new UnauthorizedException('Refresh token has been revoked');
        }
      }

      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
