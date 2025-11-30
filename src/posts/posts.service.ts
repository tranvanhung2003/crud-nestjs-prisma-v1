import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  getPosts() {
    return 'All posts';
  }

  createPost(body: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return body;
  }

  getPost(id: string) {
    return `Post ${id}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updatePost(id: string, body: any) {
    return `Updated post ${id}`;
  }

  deletePost(id: string) {
    return `Deleted post ${id}`;
  }
}
