import { PostController } from './post.controller';
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { UserEntity } from 'src/user/user.entity';
import { FollowEntity } from 'src/profile/follow.entity';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [TypeOrmModule.forFeature([PostEntity, UserEntity, FollowEntity])],
})
export class PostModule {}
