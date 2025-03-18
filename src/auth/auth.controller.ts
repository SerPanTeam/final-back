// src/auth/auth.controller.ts

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/auth/forgot-password
   * Принимаем identifier (email/username)
   * Создаём запись в БД, отправляем письмо со ссылкой
   */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: { identifier: string }) {
    // Вызовем сервис
    await this.authService.createPasswordResetToken(body);

    // Чтобы не палить, существует ли пользователь,
    // обычно возвращают универсальный ответ (200 OK).
    return { message: 'Если пользователь существует, письмо отправлено.' };
  }

  /**
   * POST /api/auth/reset-password
   * Принимаем token и password
   * Ищем токен в БД, проверяем срок, обновляем пароль
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: { token: string; password: string }) {
    await this.authService.resetPassword(body);
    return { message: 'Пароль успешно сброшен.' };
  }
}
