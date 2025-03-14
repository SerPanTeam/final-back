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
  message: string; // Короткое описание, что произошло

  // Пользователь, который получает это уведомление
  @ManyToOne(() => UserEntity, (user) => user.notifications, { eager: false })
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isRead: boolean;
}
