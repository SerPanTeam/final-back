import { FollowEntity } from './follow.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProfileType } from './types/profile.type';
import { IProfileResponse } from './types/profile-response.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly notificationService: NotificationService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async getProfile(
    currentUserId: number,
    userName: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username: userName },
    });
    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }
    const follow = await this.followRepository.findOne({
      where: { followerId: currentUserId, followingId: user.id },
    });
    const followersCount = await this.followRepository.count({
      where: { followingId: user.id },
    });
    const followingCount = await this.followRepository.count({
      where: { followerId: user.id },
    });
    return {
      ...user,
      following: Boolean(follow),
      followersCount,
      followingCount,
    };
  }

  async followProfile(
    currentUserId: number,
    userName: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username: userName },
    });
    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }
    if (currentUserId === user.id) {
      throw new HttpException(
        'Follower and following cant be equal',
        HttpStatus.BAD_REQUEST,
      );
    }
    const follow = await this.followRepository.findOne({
      where: { followerId: currentUserId, followingId: user.id },
    });
    if (!follow) {
      const followToCreate = new FollowEntity();
      followToCreate.followerId = currentUserId;
      followToCreate.followingId = user.id;
      await this.followRepository.save(followToCreate);
    }
    const followersCount = await this.followRepository.count({
      where: { followingId: user.id },
    });
    const followingCount = await this.followRepository.count({
      where: { followerId: user.id },
    });
    return { ...user, following: true, followersCount, followingCount };
  }

  async unFollowProfile(
    currentUser: UserEntity,
    userName: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username: userName },
    });
    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }
    if (currentUser.id === user.id) {
      throw new HttpException(
        'Follower and following cant be equal',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Отписываемся (в данном случае уведомление об отписке можно не отправлять)
    await this.followRepository.delete({
      followerId: currentUser.id,
      followingId: user.id,
    });
    const followersCount = await this.followRepository.count({
      where: { followingId: user.id },
    });
    const followingCount = await this.followRepository.count({
      where: { followerId: user.id },
    });
    return { ...user, following: false, followersCount, followingCount };
  }

  buildProfileResponse(profile: ProfileType): IProfileResponse {
    return { profile };
  }
}
