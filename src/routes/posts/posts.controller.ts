import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { User } from 'src/shared/decorators/user.decorator';
import { CreatePostDto, UpdatePostDto } from './posts.dto';
import { PostsService } from './posts.service';

@Auth([AuthType.BEARER])
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @Auth([AuthType.BEARER, AuthType.API_KEY], { condition: ConditionGuard.OR })
  getPosts(@User('userId') userId: number) {
    return this.postsService.getPosts(userId);
  }

  @Post()
  createPost(
    @Body() createPostDto: CreatePostDto,
    @User('userId') userId: number,
  ) {
    return this.postsService.createPost(createPostDto, userId);
  }

  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postsService.getPost(+id);
  }

  @Put(':id')
  updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @User('userId') userId: number,
  ) {
    console.log(userId);
    return this.postsService.updatePost(+id, updatePostDto, userId);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string, @User('userId') userId: number) {
    return this.postsService.deletePost(+id, userId);
  }
}
