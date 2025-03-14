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
    return { ...user, following: Boolean(follow) };
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
    return { ...user, following: true };
  }

  async unFollowProfile(
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

    // Если user.id != currentUserId, то уведомить user
    await this.notificationService.createNotification(
      user, // получает уведомление
      'follow',
      `Пользователь @${user.username} подписался на вас`,
    );

    await this.followRepository.delete({
      followerId: currentUserId,
      followingId: user.id,
    });

    return { ...user, following: false };
  }

  buildProfileResponse(profile: ProfileType): IProfileResponse {
    return { profile };
  }
}
