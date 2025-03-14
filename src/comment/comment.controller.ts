// src/comment/comment.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { User } from 'src/user/decorators/user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentEntity } from './comment.entity';

@Controller('posts/:slug/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async getComments(@Param('slug') slug: string): Promise<CommentEntity[]> {
    return this.commentService.findCommentsBySlug(slug);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createComment(
    @User() currentUser: UserEntity,
    @Param('slug') slug: string,
    @Body('comment') createCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    return this.commentService.createComment(
      currentUser,
      slug,
      createCommentDto,
    );
  }

  @Delete(':commentId')
  @UseGuards(AuthGuard)
  async deleteComment(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Param('commentId') commentId: number,
  ) {
    return this.commentService.deleteComment(slug, commentId, currentUserId);
  }
}
