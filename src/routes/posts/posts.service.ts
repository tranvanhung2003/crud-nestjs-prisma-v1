import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  isPrismaClientKnownRequestError,
  isPrismaClientNotFoundError,
} from 'src/shared/helpers/helpers';
import { PostModel } from 'src/shared/models/post.model';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreatePostDto, UpdatePostDto } from './posts.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPosts(userId: number) {
    const posts = await this.prisma.post.findMany({
      where: { authorId: userId },
      include: { author: true },
    });

    return PostModel.fromArray(posts);
  }

  async createPost(createPostDto: CreatePostDto, userId: number) {
    const post = await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        authorId: userId,
      },
      include: { author: true },
    });

    return PostModel.from(post);
  }

  async getPost(id: number) {
    try {
      const post = await this.prisma.post.findUniqueOrThrow({
        where: { id: id },
        include: { author: true },
      });

      return PostModel.from(post);
    } catch (error) {
      if (isPrismaClientKnownRequestError(error)) {
        if (isPrismaClientNotFoundError(error)) {
          throw new NotFoundException('Post not found');
        }
      }

      throw new InternalServerErrorException();
    }
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto, userId: number) {
    try {
      const post = await this.prisma.post.update({
        where: { id: id, authorId: userId },
        data: {
          title: updatePostDto.title,
          content: updatePostDto.content,
        },
        include: { author: true },
      });

      return PostModel.from(post);
    } catch (error) {
      if (isPrismaClientKnownRequestError(error)) {
        if (isPrismaClientNotFoundError(error)) {
          throw new NotFoundException('Post not found');
        }
      }

      throw new InternalServerErrorException();
    }
  }

  async deletePost(id: number, userId: number) {
    try {
      await this.prisma.post.delete({
        where: { id: id, authorId: userId },
      });

      return { message: 'Post deleted successfully' };
    } catch (error) {
      if (isPrismaClientKnownRequestError(error)) {
        if (isPrismaClientNotFoundError(error)) {
          throw new NotFoundException('Post not found');
        }
      }

      throw new InternalServerErrorException();
    }
  }
}
