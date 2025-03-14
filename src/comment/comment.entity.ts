// src/comment/comment.entity.ts

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { PostEntity } from 'src/post/post.entity';

@Entity({ name: 'comments' })
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Автор комментария
  @ManyToOne(() => UserEntity, (user) => user.comments, { eager: true })
  author: UserEntity;

  // Пост, к которому принадлежит комментарий
  @ManyToOne(() => PostEntity, (post) => post.comments, { onDelete: 'CASCADE' })
  post: PostEntity;
}
