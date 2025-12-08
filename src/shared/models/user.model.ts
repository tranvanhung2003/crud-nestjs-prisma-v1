import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserModel implements User {
  id: number;
  email: string;
  name: string;
  @Exclude()
  password: string;
  createdAt: Date;
  updatedAt: Date;

  private constructor(partial: Partial<UserModel>) {
    Object.assign(this, partial);
  }

  static from(user: Partial<UserModel>) {
    return new UserModel(user);
  }

  static fromArray(users: Partial<UserModel>[]) {
    return users.map((user) => new UserModel(user));
  }
}
