import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from './notification.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  // Создание уведомления с указанием получателя и инициатора
  async createNotification(
    recipient: UserEntity,
    initiator: UserEntity,
    type: string,
    message: string,
  ): Promise<NotificationEntity> {
    const notification = new NotificationEntity();
    notification.user = recipient; // получатель уведомления
    notification.initiator = initiator; // пользователь, вызвавший уведомление
    notification.type = type;
    notification.message = message;
    return await this.notificationRepository.save(notification);
  }

  async getUserNotifications(userId: number): Promise<NotificationEntity[]> {
    return this.notificationRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(notificationId: number, userId: number): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
      relations: ['user'],
    });
    if (!notification || notification.user.id !== userId) {
      return;
    }
    notification.isRead = true;
    await this.notificationRepository.save(notification);
  }
}
