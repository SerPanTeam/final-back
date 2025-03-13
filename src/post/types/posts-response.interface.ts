import { PostEntity } from '../post.entity';
import { PostType } from './post.type';

export interface IPostsResponse {
  //post: PostEntity;
  posts: PostType[];
  postsCount: number;
}
