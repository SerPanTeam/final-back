import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';

@Entity({ name: 'messages' })
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  // Отправитель
  @ManyToOne(() => UserEntity, { eager: true })
  sender: UserEntity;

  // Получатель
  @ManyToOne(() => UserEntity, { eager: true })
  recipient: UserEntity;

  @CreateDateColumn()
  createdAt: Date;
}
