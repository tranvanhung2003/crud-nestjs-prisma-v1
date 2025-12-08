import { Post } from '@prisma/client';
import { IsString } from 'class-validator';

export class CreatePostDto implements Pick<Post, 'title' | 'content'> {
  @IsString()
  title: string;

  @IsString()
  content: string;
}
export class UpdatePostDto extends CreatePostDto {}
