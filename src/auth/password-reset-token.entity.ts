// src/auth/password-reset-token.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  BaseEntity,
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';

@Entity({ name: 'password_reset_tokens' })
export class PasswordResetTokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Храним не сам токен, а его хеш (tokenHash),
   * чтобы в случае утечки БД злоумышленники не могли им воспользоваться.
   */
  @Column()
  tokenHash: string;

  @ManyToOne(() => UserEntity, { eager: true })
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  // Срок действия (например, 1 час)
  @Column()
  expiresAt: Date;

  // Пометка, что токен уже использован
  @Column({ default: false })
  used: boolean;
}
