import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'messages' })
export class MessageEntity {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор сообщения',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Привет!', description: 'Текст сообщения' })
  @Column()
  content: string;

  @ApiProperty({ example: 'room123', description: 'ID комнаты (roomId)' })
  @Column({ nullable: true })
  roomId: string;

  @ApiProperty({
    description: 'Пользователь-отправитель сообщения (объект UserEntity)',
  })
  @ManyToOne(() => UserEntity, { eager: true })
  sender: UserEntity;

  @ApiProperty({
    description: 'Пользователь-получатель сообщения (объект UserEntity)',
  })
  @ManyToOne(() => UserEntity, { eager: true })
  recipient: UserEntity;

  @ApiProperty({ description: 'Время создания сообщения (таймстамп)' })
  @CreateDateColumn()
  createdAt: Date;
}
