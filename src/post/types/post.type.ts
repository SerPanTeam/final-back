import { PostEntity } from '../post.entity';

export type PostType = Omit<PostEntity, 'updateTimeStamp'>;
