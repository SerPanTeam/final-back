import { IsNotEmpty } from 'class-validator';
import { UserEntity } from 'src/user/user.entity';

export class CreatePostDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly content: string;

  @IsNotEmpty()
  readonly img: string;

  // @IsNotEmpty()
  // readonly author: UserEntity;
}
