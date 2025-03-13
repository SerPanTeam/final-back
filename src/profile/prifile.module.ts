import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProflileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserEntity } from 'src/user/user.entity';
import { FollowEntity } from './follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FollowEntity])],
  controllers: [ProflileController],
  providers: [ProfileService],
})
export class ProfileModule {}
