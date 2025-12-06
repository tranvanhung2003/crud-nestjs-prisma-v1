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
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @Auth([AuthType.BEARER, AuthType.API_KEY], { condition: ConditionGuard.OR })
  getPosts() {
    return this.postsService.getPosts();
  }

  @Post()
  createPost(@Body() body: any) {
    return this.postsService.createPost(body);
  }

  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postsService.getPost(id);
  }

  @Put(':id')
  updatePost(@Param('id') id: string, @Body() body: any) {
    return this.postsService.updatePost(id, body);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }
}
