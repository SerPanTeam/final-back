// src/comment/comment.service.ts

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { Repository } from 'typeorm';
import { PostEntity } from 'src/post/post.entity';
import { UserEntity } from 'src/user/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly notificationService: NotificationService,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async createComment(
    user: UserEntity,
    slug: string,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    const post = await this.postRepository.findOne({ where: { slug } });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    const newComment = new CommentEntity();
    newComment.body = createCommentDto.body;
    newComment.author = user;
    newComment.post = post;

    await this.notificationService.createNotification(
      post.author,
      user,
      'comment',
      `New comment from ${user.username} on your post "${post.title}"`,
    );

    return await this.commentRepository.save(newComment);
  }

  async deleteComment(
    slug: string,
    commentId: number,
    currentUserId: number,
  ): Promise<any> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['author', 'post'],
    });
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    if (comment.post.slug !== slug) {
      throw new HttpException(
        'Comment does not belong to this post',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (comment.author.id !== currentUserId) {
      throw new HttpException(
        'Not authorized to delete this comment',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.commentRepository.delete({ id: commentId });
  }

  async findCommentsBySlug(slug: string): Promise<CommentEntity[]> {
    // Для удобства можно вместо "post.slug" просто делать JOIN. Но для простоты:
    const comments = await this.commentRepository.find({
      where: { post: { slug } },
      order: { createdAt: 'ASC' },
    });
    return comments;
  }
}
