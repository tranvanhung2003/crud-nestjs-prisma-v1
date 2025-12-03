import { JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

export type TokenPayload = {
  userId: number;
  iat?: number;
  exp?: number;
};

export type SignOptions = Pick<JwtSignOptions, 'secret' | 'expiresIn'>;

export type ExpiresIn = JwtSignOptions['expiresIn'];

export type VerifyOptions = Pick<JwtVerifyOptions, 'secret'>;
