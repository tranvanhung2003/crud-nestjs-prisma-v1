import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { CustomErrors } from './helpers/helpers';

// Kiểm tra xem có file .env không
if (!fs.existsSync(path.resolve('.env'))) {
  console.log('Không tìm thấy file .env');
  process.exit(1);
}

class ConfigSchema {
  @IsString()
  DATABASE_URL: string;

  @IsNumber()
  PORT: number;

  @IsString()
  ACCESS_TOKEN_SECRET: string;

  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string;

  @IsString()
  REFRESH_TOKEN_SECRET: string;

  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string;
}

const configServer = plainToInstance(ConfigSchema, process.env, {
  enableImplicitConversion: true,
});
const errors = validateSync(configServer);

if (errors.length > 0) {
  console.log('Các giá trị cấu hình trong file .env không hợp lệ');

  const errorDetails: CustomErrors = errors.map((error) => ({
    field: error.property,
    error: Object.values(error.constraints || {}).join(', '),
  }));

  throw new Error(JSON.stringify(errorDetails, null, 2));
}

const envConfig = configServer;

export default envConfig;
