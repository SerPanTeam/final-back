// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
import { PasswordResetTokenEntity } from './password-reset-token.entity';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PasswordResetTokenEntity, UserEntity]),
    // Подключаем MailerModule
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // Настройки для Nodemailer
        // Вы можете использовать любой SMTP (например, Mailtrap, Gmail, SendGrid)
        transport: {
          host: configService.get<string>(
            'MAIL_HOST',
            'rocket-cms1.hostsila.org',
          ),
          port: configService.get<number>('MAIL_PORT', 465),
          secure: true, // важный момент для 465
          auth: {
            user: configService.get<string>(
              'MAIL_USER',
              'admin@api.panchenko.work',
            ),
            pass: configService.get<string>('MAIL_PASS', '36355693801'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@example.com>',
        },
        template: {
          dir: join(__dirname, 'templates'), // путь к папке с шаблонами писем
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
  exports: [AuthService],
})
export class AuthModule {}
