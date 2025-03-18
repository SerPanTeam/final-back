import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  BaseEntity,
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';

@Entity({ name: 'notifications' })
export class NotificationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; // Например: 'favorite', 'comment', 'follow'

  @Column()
  message: string; // Краткое описание события

  // Получатель уведомления
  @ManyToOne(() => UserEntity, (user) => user.notifications, { eager: false })
  user: UserEntity;

  // Инициатор действия (пользователь, который совершил действие)
  @ManyToOne(() => UserEntity, { eager: true, nullable: true })
  initiator: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isRead: boolean;
}
