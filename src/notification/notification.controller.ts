import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { User } from 'src/user/decorators/user.decorator';
import { NotificationEntity } from './notification.entity';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // Получить все уведомления текущего пользователя
  @Get()
  @UseGuards(AuthGuard)
  async getMyNotifications(
    @User('id') currentUserId: number,
  ): Promise<NotificationEntity[]> {
    return this.notificationService.getUserNotifications(currentUserId);
  }

  // Пометить конкретное уведомление как прочитанное
  @Patch(':id/read')
  @UseGuards(AuthGuard)
  async markNotificationAsRead(
    @User('id') currentUserId: number,
    @Param('id') notificationId: number,
  ) {
    return this.notificationService.markAsRead(notificationId, currentUserId);
  }
}
