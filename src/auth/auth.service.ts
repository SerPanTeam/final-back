// src/auth/auth.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordResetTokenEntity } from './password-reset-token.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { createHash, randomBytes } from 'crypto';
import { hash as bcryptHash } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { MailerService } from '@nestjs-modules/mailer';

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
   * 1) Ищем пользователя по email/username
   * 2) Генерируем случайный токен и хешируем его
   * 3) Сохраняем в таблице password_reset_tokens
   * 4) Отправляем письмо со ссылкой на сброс
   */
  async createPasswordResetToken(dto: IForgotPasswordDto): Promise<void> {
    // 1. Ищем пользователя в БД
    const user = await this.userRepository.findOne({
      where: [{ email: dto.identifier }, { username: dto.identifier }],
    });

    // Чтобы «не палить» существование пользователя, можно всегда возвращать 200 OK,
    // но для примера выбрасываем явную ошибку:
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // 2. Генерируем «сырой» токен
    const rawToken = randomBytes(32).toString('hex');

    // Хешируем токен (SHA256), чтобы хранить в БД
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');

    // Устанавливаем срок действия (например, 1 час)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // 3. Сохраняем запись в таблице
    const resetToken = new PasswordResetTokenEntity();
    resetToken.tokenHash = tokenHash;
    resetToken.user = user;
    resetToken.expiresAt = expiresAt;
    resetToken.used = false;
    await this.resetTokenRepository.save(resetToken);

    // 4. Формируем ссылку на сброс (URL фронтенда)
    const resetLink = `https://realtygram.panchenko.work/reset-password/${rawToken}`;

    // 5. Отправляем письмо
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Сброс пароля',
      // Если используете Handlebars-шаблон:
      // template: 'reset-password',
      // context: { resetLink, userName: user.username },
      text: `Перейдите по ссылке, чтобы сбросить пароль: ${resetLink}`,
      html: `
        <p>Здравствуйте, ${user.username}.</p>
        <p>Чтобы сбросить пароль, перейдите по ссылке:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    // Всё, вернём 200 OK
  }

  /**
   * 1) Ищем токен в БД (по SHA256)
   * 2) Проверяем, не истёк ли срок, не used ли
   * 3) Генерируем новый хеш пароля
   * 4) Обновляем поле password напрямую в базе (userRepository.update)
   * 5) Помечаем токен used = true
   */

  async resetPassword(dto: IResetPasswordDto): Promise<void> {
    const { token, password } = dto;

    // Хешируем «сырой» token из тела запроса, чтобы найти в БД
    const tokenHash = createHash('sha256').update(token).digest('hex');

    // Находим запись токена в таблице password_reset_tokens
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

    // 1. Хешируем новый пароль
    const hashedPassword = await bcryptHash(password, 10);

    // 2. Меняем пароль напрямую в таблице users
    //    (не "save", а "update" — так надёжнее с учётом {select: false})
    await this.userRepository.update(tokenEntity.user.id, {
      password: hashedPassword,
    });

    // 3. Помечаем токен как использованный
    tokenEntity.used = true;
    await this.resetTokenRepository.save(tokenEntity);

    // Теперь в базе точно хранится новый пароль (захешированный)
  }
}
