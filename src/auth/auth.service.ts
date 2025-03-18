// src/auth/auth.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordResetTokenEntity } from './password-reset-token.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { randomBytes, createHash } from 'crypto';
import { compare, hash as bcryptHash } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { MailerService } from '@nestjs-modules/mailer';

// DTO (для наглядности)
interface IForgotPasswordDto {
  identifier: string; // email / username / телефон и т.п.
}
interface IResetPasswordDto {
  token: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(PasswordResetTokenEntity)
    private readonly resetTokenRepository: Repository<PasswordResetTokenEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  /**
   * 1. Ищем пользователя по email/username
   * 2. Генерируем токен и хешируем
   * 3. Сохраняем в таблице password_reset_tokens
   * 4. Отправляем письмо со ссылкой на сброс
   */
  async createPasswordResetToken(dto: IForgotPasswordDto): Promise<void> {
    // Ищем пользователя (по email или username)
    const user = await this.userRepository.findOne({
      where: [{ email: dto.identifier }, { username: dto.identifier }],
    });
    // Чтобы не «палить», что юзер не найден, можно возвращать 200 OK
    // Но для примера явно бросим ошибку
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Генерируем «сырой» токен (randomBytes)
    const rawToken = randomBytes(32).toString('hex');

    // Хешируем (например, SHA256)
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 час
    const resetToken = new PasswordResetTokenEntity();
    resetToken.tokenHash = tokenHash;
    resetToken.user = user;
    resetToken.expiresAt = expiresAt;
    resetToken.used = false;
    await this.resetTokenRepository.save(resetToken);

    // Формируем ссылку на сброс (например, фронтенд: https://my-frontend.com/reset-password/...)
    const resetLink = `https://v0-final-proj.vercel.app/reset-password/${rawToken}`;

    // Отправляем письмо:
    await this.mailerService.sendMail({
      to: user.email, // кому
      subject: 'Сброс пароля', // тема
      // Если используете шаблоны Handlebars
      // template: 'reset-password', // напр. reset-password.hbs в папке templates
      // context: { resetLink, userName: user.username }

      // Или можно просто text/html
      text: `Перейдите по ссылке, чтобы сбросить пароль: ${resetLink}`,
      html: `<p>Здравствуйте, ${user.username}.</p>
             <p>Чтобы сбросить пароль, перейдите по ссылке:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    // Возвращать можно любую полезную информацию, но обычно достаточно 200 OK
  }

  /**
   * 1. Приходит «сырой» token
   * 2. Делаем из него SHA256 и ищем в БД
   * 3. Проверяем expiresAt и used
   * 4. Если всё ок, хешируем новый пароль и сохраняем
   * 5. Помечаем токен как used
   */
  async resetPassword(dto: IResetPasswordDto): Promise<void> {
    const { token, password } = dto;
    const tokenHash = createHash('sha256').update(token).digest('hex');

    // Ищем токен в БД
    const tokenEntity = await this.resetTokenRepository.findOne({
      where: { tokenHash },
      relations: ['user'],
    });
    if (!tokenEntity) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    if (tokenEntity.used) {
      throw new HttpException('Token already used', HttpStatus.BAD_REQUEST);
    }
    if (tokenEntity.expiresAt < new Date()) {
      throw new HttpException('Token expired', HttpStatus.BAD_REQUEST);
    }

    // Обновляем пароль (хешируем вручную, т.к. @BeforeInsert() срабатывает только на insert)
    const user = tokenEntity.user;
    const hashedPassword = await bcryptHash(password, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user);

    // Помечаем токен как использованный
    tokenEntity.used = true;
    await this.resetTokenRepository.save(tokenEntity);
  }
}
