import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/user/decorators/user.decorator';
import { IProfileResponse } from './types/profile-response.interface';
import { ProfileService } from './profile.service';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { UserEntity } from 'src/user/user.entity';

@Controller('profiles')
export class ProflileController {
  constructor(private readonly profileService: ProfileService) {}

  // GET /profiles/:username - возвращает профиль с количеством подписчиков и подписок
  @Get(':username')
  @UseGuards(AuthGuard)
  async getProfile(
    @User('id') currentUserId: number,
    @Param('username') username: string,
  ): Promise<IProfileResponse> {
    const profile = await this.profileService.getProfile(
      currentUserId,
      username,
    );
    return this.profileService.buildProfileResponse(profile);
  }

  // POST /profiles/:username/follow - подписка на пользователя
  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @User('id') currentUserId: number,
    @Param('username') username: string,
  ): Promise<IProfileResponse> {
    const profile = await this.profileService.followProfile(
      currentUserId,
      username,
    );
    return this.profileService.buildProfileResponse(profile);
  }

  // DELETE /profiles/:username/follow - отписка от пользователя
  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unFollowProfile(
    @User() currentUser: UserEntity,
    @Param('username') username: string,
  ): Promise<IProfileResponse> {
    const profile = await this.profileService.unFollowProfile(
      currentUser,
      username,
    );
    return this.profileService.buildProfileResponse(profile);
  }
}
