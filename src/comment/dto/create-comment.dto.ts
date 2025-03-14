// src/comment/dto/create-comment.dto.ts

import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  readonly body: string;
}
