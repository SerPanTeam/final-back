# Структура проекта

```plaintext
├── src
│   ├── chat
│   │   ├── chat.gateway.ts
│   │   ├── chat.module.ts
│   │   └── message.entity.ts
│   ├── comment
│   │   ├── dto
│   │   │   └── create-comment.dto.ts
│   │   ├── comment.controller.ts
│   │   ├── comment.entity.ts
│   │   ├── comment.module.ts
│   │   └── comment.service.ts
│   ├── notification
│   │   ├── notification.controller.ts
│   │   ├── notification.entity.ts
│   │   ├── notification.module.ts
│   │   └── notification.service.ts
│   ├── post
│   │   ├── dto
│   │   │   └── create-post.dto.ts
│   │   ├── types
│   │   │   ├── post-response.interface.ts
│   │   │   ├── post.type.ts
│   │   │   └── posts-response.interface.ts
│   │   ├── post.controller.ts
│   │   ├── post.entity.ts
│   │   ├── post.module.ts
│   │   └── post.service.ts
│   ├── profile
│   │   ├── types
│   │   │   ├── profile-response.interface.ts
│   │   │   └── profile.type.ts
│   │   ├── follow.entity.ts
│   │   ├── prifile.module.ts
│   │   ├── profile.controller.ts
│   │   └── profile.service.ts
│   ├── types
│   │   └── express-request.interface.ts
│   ├── uploads
│   ├── user
│   │   ├── decorators
│   │   │   └── user.decorator.ts
│   │   ├── dto
│   │   │   ├── create-user.dto.ts
│   │   │   ├── login-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── guards
│   │   │   └── auth.guard.ts
│   │   ├── middlewares
│   │   │   └── auth.middleware.ts
│   │   ├── types
│   │   │   ├── user-response.interface.ts
│   │   │   └── user.type.ts
│   │   ├── user.controller.ts
│   │   ├── user.entity.ts
│   │   ├── user.module.ts
│   │   └── user.service.ts
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── config.ts
│   ├── main.ts
│   ├── orm-config.ts
│   └── seed.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── uploads
│   ├── avatars
│   └── posts
├── .env
├── .gitignore
├── .prettierrc
├── codewr.js
├── combined-files.md
├── deploy.js
├── eslint.config.mjs
├── nest-cli.json
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.build.json
└── tsconfig.json

```

# Файлы .ts, .tsx, .css

## deploy.js

```javascript
const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();

// Выводим весь объект события при начале копирования
ftpDeploy.on('uploading', (data) => {
  console.log('Копируется файл:', JSON.stringify(data, null, 2));
});

// Выводим весь объект события после успешного копирования
ftpDeploy.on('uploaded', (data) => {
  console.log('Файл скопирован:', JSON.stringify(data, null, 2));
});

// Вывод логов для отладки
ftpDeploy.on('log', (message) => {
  console.log('Лог:', message);
});

// Обработчик ошибок (если требуется)
ftpDeploy.on('error', (err) => {
  console.error('Ошибка (событие error):', err);
});

const config = {
  user: 'api@api.panchenko.work', // FTP логин
  password: '36355693801', // FTP пароль
  host: '185.67.3.96', // FTP-сервер
  port: 21, // Явный порт FTPS
  localRoot: __dirname, // Корневая папка проекта
  remoteRoot: '/', // Путь на сервере, куда будут загружаться файлы
  include: ['*', '**/*'], // Файлы, которые необходимо копировать
  exclude: ['**/node_modules/**', '**/.git/**'], // исключаем node_modules и .git
  deleteRemote: false, // Не удалять файлы на сервере, которых нет локально
  forcePasv: true, // Режим Passive (иногда требуется для обхода firewall)
};

ftpDeploy.deploy(config, function (err) {
  if (err) {
    console.error('Ошибка при деплое:', err);
  } else {
    console.log('Деплой выполнен успешно!');
  }
});

// const FtpDeploy = require('ftp-deploy');
// const ftpDeploy = new FtpDeploy();

// const config = {
//   user: 'api@api.panchenko.work', // FTP логин
//   password: '36355693801', // FTP пароль
//   host: '185.67.3.96', // FTP-сервер
//   port: 21, // Явный порт FTPS
//   localRoot: __dirname, // Корневая папка проекта
//   remoteRoot: '/', // Путь на сервере, куда будут загружаться файлы
//   include: ['*', '**/*'], // Файлы, которые необходимо копировать
//   exclude: ['**/node_modules/**', '**/.git/**'], // исключаем node_modules и .git
//   deleteRemote: false, // Не удалять файлы на сервере, которых нет локально
//   forcePasv: true, // Режим Passive (иногда требуется для обхода firewall)
// };

// ftpDeploy.deploy(config, function (err) {
//   if (err) {
//     console.error('Ошибка при деплое:', err);
//   } else {
//     console.log('Деплой выполнен успешно!');
//   }
// });

// // const FtpDeploy = require('ftp-deploy');
// // const ftpDeploy = new FtpDeploy();

// // const config = {
// //   user: 'api@api.panchenko.work', // FTP логин
// //   password: '36355693801', // FTP пароль
// //   host: '185.67.3.96', // FTP-сервер
// //   port: 21, // Явный порт FTPS
// //   localRoot: __dirname + '/', // Локальная папка с собранными файлами
// //   remoteRoot: '/', // Путь на сервере, куда будут загружаться файлы
// //   include: ['*', '**/*'], // Какие файлы копировать
// //   exclude: ['node_modules', 'node_modules/**'], // Исключаем папку node_modules
// //   deleteRemote: false, // Не удалять файлы на сервере, которых нет локально
// //   forcePasv: true, // Режим Passive (часто требуется для обхода firewall)
// // };

// // ftpDeploy.deploy(config, function (err) {
// //   if (err) {
// //     console.error('Ошибка при деплое:', err);
// //   } else {
// //     console.log('Деплой выполнен успешно!');
// //   }
// // });

```

## src\app.controller.spec.ts

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});

```

## src\app.controller.ts

```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

```

## src\app.module.ts

```typescript
import { PostModule } from './post/post.module';
import { AuthMiddleware } from './user/middlewares/auth.middleware';
import { UserModule } from './user/user.module';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfigFactory } from './orm-config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProfileModule } from './profile/prifile.module';
import { NotificationModule } from './notification/notification.module';
import { ChatModule } from './chat/chat.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommentModule,
    ChatModule,
    NotificationModule,
    ProfileModule,
    UserModule,
    PostModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ormConfigFactory(configService),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}

```

## src\app.service.ts

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

```

## src\chat\chat.gateway.ts

```typescript
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from './message.entity';
import { UserEntity } from 'src/user/user.entity';

@WebSocketGateway({
  cors: {
    origin: '*', // при необходимости указать конкретные адреса
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  // Пользователь (клиент) вызывает событие 'joinRoom' и передаёт ID комнаты, чтобы "зайти" в неё
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = data;
    client.join(roomId);
    client.emit('joinedRoom', { roomId });
  }

  // Отправка сообщения: клиент вызывает 'sendMessage' и передаёт roomId, senderId, recipientId, content
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    data: {
      roomId: string;
      senderId: number;
      recipientId: number;
      content: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    // 1. Сохраняем сообщение в БД (если нужно)
    const message = new MessageEntity();
    message.content = data.content;
    // Здесь вам надо найти UserEntity по ID
    // Но для упрощения примера пропустим детализацию. Если очень нужно:
    // const sender = await this.userRepository.findOne({ where: { id: data.senderId } });
    // const recipient = await this.userRepository.findOne({ where: { id: data.recipientId } });
    // message.sender = sender;
    // message.recipient = recipient;

    // Если у вас нет userRepository, можно сохранить чисто ID, но тогда нужна дополнительная логика
    // Или сделаем так (будет ошибка, если юзера не найдёт):
    const sender = new UserEntity();
    sender.id = data.senderId;
    message.sender = sender;

    const recipient = new UserEntity();
    recipient.id = data.recipientId;
    message.recipient = recipient;

    await this.messageRepository.save(message);

    // 2. Отправляем (broadcast) это сообщение в комнату roomId
    this.server.to(data.roomId).emit('receiveMessage', {
      id: message.id,
      content: message.content,
      senderId: data.senderId,
      recipientId: data.recipientId,
      createdAt: message.createdAt,
    });
  }
}

```

## src\chat\chat.module.ts

```typescript
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity])],
  providers: [ChatGateway],
})
export class ChatModule {}

```

## src\chat\message.entity.ts

```typescript
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

```

## src\comment\comment.controller.ts

```typescript
// src/comment/comment.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { User } from 'src/user/decorators/user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentEntity } from './comment.entity';

@Controller('posts/:slug/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async getComments(@Param('slug') slug: string): Promise<CommentEntity[]> {
    return this.commentService.findCommentsBySlug(slug);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createComment(
    @User() currentUser: UserEntity,
    @Param('slug') slug: string,
    @Body('comment') createCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    return this.commentService.createComment(
      currentUser,
      slug,
      createCommentDto,
    );
  }

  @Delete(':commentId')
  @UseGuards(AuthGuard)
  async deleteComment(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Param('commentId') commentId: number,
  ) {
    return this.commentService.deleteComment(slug, commentId, currentUserId);
  }
}

```

## src\comment\comment.entity.ts

```typescript
// src/comment/comment.entity.ts

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { PostEntity } from 'src/post/post.entity';

@Entity({ name: 'comments' })
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Автор комментария
  @ManyToOne(() => UserEntity, (user) => user.comments, { eager: true })
  author: UserEntity;

  // Пост, к которому принадлежит комментарий
  @ManyToOne(() => PostEntity, (post) => post.comments, { onDelete: 'CASCADE' })
  post: PostEntity;
}

```

## src\comment\comment.module.ts

```typescript
// src/comment/comment.module.ts

import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { PostEntity } from 'src/post/post.entity';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, PostEntity]),
    NotificationModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}

```

## src\comment\comment.service.ts

```typescript
// src/comment/comment.service.ts

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { Repository } from 'typeorm';
import { PostEntity } from 'src/post/post.entity';
import { UserEntity } from 'src/user/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly notificationService: NotificationService,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async createComment(
    user: UserEntity,
    slug: string,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    const post = await this.postRepository.findOne({ where: { slug } });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    const newComment = new CommentEntity();
    newComment.body = createCommentDto.body;
    newComment.author = user;
    newComment.post = post;

    await this.notificationService.createNotification(
      post.author,
      'comment',
      `New comment from ${user.username} on your post "${post.title}"`,
    );

    return await this.commentRepository.save(newComment);
  }

  async deleteComment(
    slug: string,
    commentId: number,
    currentUserId: number,
  ): Promise<any> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['author', 'post'],
    });
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    if (comment.post.slug !== slug) {
      throw new HttpException(
        'Comment does not belong to this post',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (comment.author.id !== currentUserId) {
      throw new HttpException(
        'Not authorized to delete this comment',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.commentRepository.delete({ id: commentId });
  }

  async findCommentsBySlug(slug: string): Promise<CommentEntity[]> {
    // Для удобства можно вместо "post.slug" просто делать JOIN. Но для простоты:
    const comments = await this.commentRepository.find({
      where: { post: { slug } },
      order: { createdAt: 'ASC' },
    });
    return comments;
  }
}

```

## src\comment\dto\create-comment.dto.ts

```typescript
// src/comment/dto/create-comment.dto.ts

import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  readonly body: string;
}

```

## src\config.ts

```typescript
// export const JWT_SECRET = 'JWT_SECRET';

```

## src\main.ts

```typescript
import { join } from 'path';
import * as express from 'express';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('Final project API')
    .setDescription('Project API documentation')
    .setVersion('1.0')
    .addBearerAuth() // Если используется JWT-авторизация
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

```

## src\notification\notification.controller.ts

```typescript
import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { User } from 'src/user/decorators/user.decorator';
import { NotificationEntity } from './notification.entity';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // Получить все уведомления текущего пользователя
  @Get()
  @UseGuards(AuthGuard)
  async getMyNotifications(
    @User('id') currentUserId: number,
  ): Promise<NotificationEntity[]> {
    return this.notificationService.getUserNotifications(currentUserId);
  }

  // Пометить конкретное уведомление как прочитанное
  @Patch(':id/read')
  @UseGuards(AuthGuard)
  async markNotificationAsRead(
    @User('id') currentUserId: number,
    @Param('id') notificationId: number,
  ) {
    return this.notificationService.markAsRead(notificationId, currentUserId);
  }
}

```

## src\notification\notification.entity.ts

```typescript
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

```

## src\notification\notification.module.ts

```typescript
import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService], // чтобы другие модули могли вызывать createNotification
})
export class NotificationModule {}

```

## src\notification\notification.service.ts

```typescript
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

  // Создание уведомления, например, при лайке, комментарии, подписке
  async createNotification(
    user: UserEntity,
    type: string,
    message: string,
  ): Promise<NotificationEntity> {
    const notification = new NotificationEntity();
    notification.user = user; // кому уходит уведомление
    notification.type = type;
    notification.message = message;
    return await this.notificationRepository.save(notification);
  }

  // Получить все уведомления пользователя
  async getUserNotifications(userId: number): Promise<NotificationEntity[]> {
    return this.notificationRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  // Пометить уведомление как прочитанное
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

```

## src\orm-config.ts

```typescript
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const ormConfigFactory = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  // Если переменная окружения отсутствует, будет использовано значение '5432'
  port: +configService.get<string>('DB_PORT', '5432'),
  username: configService.get<string>('DB_USERNAME', 'panchenkowork_postgres'),
  password: configService.get<string>('DB_PASSWORD', '36355693801'),
  database: configService.get<string>('DB_NAME', 'panchenkowork_db'),
  entities: [__dirname + '/**/*.entity.{ts,js}'],
  synchronize: true, // для production лучше отключить
});

// import { DataSourceOptions } from 'typeorm';

// const config: DataSourceOptions = {
//   type: 'postgres',

//   host: 'localhost',
//   port: 5432,
//   username: 'postgres',
//   password: '36355693801',
//   database: 'db',

//   entities: [__dirname + '/**/*.entity.{ts,js}'], // ✅ Исправленный путь
//   synchronize: true,
// };

// export default config;

```

## src\post\dto\create-post.dto.ts

```typescript
import { IsNotEmpty } from 'class-validator';
import { UserEntity } from 'src/user/user.entity';

export class CreatePostDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly content: string;

  @IsNotEmpty()
  readonly img: string;

  // @IsNotEmpty()
  // readonly author: UserEntity;
}

```

## src\post\post.controller.ts

```typescript
import { AuthGuard } from 'src/user/guards/auth.guard';
import { PostService } from './post.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from 'src/user/decorators/user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { IPostResponse } from './types/post-response.interface';
import { IPostsResponse } from './types/posts-response.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async findAll(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<IPostsResponse> {
    return await this.postService.findAll(currentUserId, query);
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  async getFeed(
    @User('id') currenUserId: number,
    @Query() query: any,
  ): Promise<IPostsResponse> {
    return await this.postService.getFeed(currenUserId, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async create(
    @User() currentUser: UserEntity,
    @Body('post') createPostDto: CreatePostDto,
  ): Promise<IPostResponse> {
    const post = await this.postService.createPost(currentUser, createPostDto);
    return this.postService.bildPostResponse(post);
  }

  @Get(':slug')
  async getPostBySlug(
    @Param('slug') slug: string,
  ): Promise<IPostResponse | undefined> {
    const post = await this.postService.findBySlug(slug);
    if (post) return this.postService.bildPostResponse(post);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deletePostBySlug(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ) {
    return await this.postService.deleteBySlug(slug, currentUserId);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updatePost(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Body('post') updatePostDto: CreatePostDto,
  ): Promise<IPostResponse> {
    const post = await this.postService.updatePost(
      slug,
      updatePostDto,
      currentUserId,
    );
    return this.postService.bildPostResponse(post);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addArticleToFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<IPostResponse> {
    const post = await this.postService.addArticleToFavorites(
      slug,
      currentUserId,
    );
    if (post) return this.postService.bildPostResponse(post);
    else return null as any;
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async delArticleToFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<IPostResponse> {
    const post = await this.postService.delArticleToFavorites(
      slug,
      currentUserId,
    );
    if (post) return this.postService.bildPostResponse(post);
    else return null as any;
  }

  @Post(':slug/uploadImage')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/posts',
        filename: (req, file, callback) => {
          const ext = extname(file.originalname);
          const fileName = `post_${Date.now()}${ext}`;
          callback(null, fileName);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // ограничение ~5MB
    }),
  )
  async uploadPostImage(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const filePath = `uploads/posts/${file.filename}`;

    // вызываем сервис, чтобы обновить поле img у поста
    const updatedPost = await this.postService.setPostImage(
      slug,
      currentUserId,
      filePath,
    );

    // Возвращаем обновлённый пост
    return this.postService.bildPostResponse(updatedPost);
  }
}

```

## src\post\post.entity.ts

```typescript
import { CommentEntity } from 'src/comment/comment.entity';
import { UserEntity } from 'src/user/user.entity';
import {
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'posts' })
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column({ default: '' })
  title: string;

  @Column({ default: '' })
  content: string;

  @Column({ default: '' })
  img: string;

  @Column('simple-array')
  tagList: string[];

  @Column({ default: 0 })
  favoritesCount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimeStamp() {
    this.updatedAt = new Date();
  }

  @ManyToOne(() => UserEntity, (user) => user.posts, { eager: true })
  author: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.post, { eager: true })
  comments: CommentEntity[];
}

```

## src\post\post.module.ts

```typescript
import { PostController } from './post.controller';
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { UserEntity } from 'src/user/user.entity';
import { FollowEntity } from 'src/profile/follow.entity';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [
    TypeOrmModule.forFeature([PostEntity, UserEntity, FollowEntity]),
    NotificationModule,
  ],
})
export class PostModule {}

```

## src\post\post.service.ts

```typescript
import { IPostsResponse } from './types/posts-response.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { IPostResponse } from './types/post-response.interface';
import slugify from 'slugify';
import { FollowEntity } from 'src/profile/follow.entity';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class PostService {
  constructor(
    private readonly notificationService: NotificationService,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private dataSourse: DataSource,
  ) {}

  async findAll(currentUserId: number, query: any): Promise<IPostsResponse> {
    const queryBuilder = this.dataSourse
      .getRepository(PostEntity)
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.author', 'author');

    queryBuilder.orderBy('posts.createdAt', 'DESC');
    const postsCount = await queryBuilder.getCount();

    if (query.author) {
      const author = await this.userRepository.findOne({
        where: { username: query.author },
      });
      if (author)
        queryBuilder.andWhere('posts.authorId = :id', { id: author.id });
    }

    if (query.favorited) {
      const author = await this.userRepository.findOne({
        where: { username: query.favorited },
        relations: ['favorites'],
      });
      // console.log(author);
      const ids = author?.favorites.map((val) => val.id);
      if (ids && ids?.length > 0)
        queryBuilder.andWhere('posts.id IN (:...ids)', { ids });
      else queryBuilder.andWhere('1=0');
    }

    if (query.limit) queryBuilder.limit(query.limit);
    if (query.offset) queryBuilder.offset(query.offset);

    let favoriteIds: number[] | undefined = [];
    if (currentUserId) {
      const currentUser = await this.userRepository.findOne({
        where: { id: currentUserId },
        relations: ['favorites'],
      });
      favoriteIds = currentUser?.favorites.map((favorite) => favorite.id);
    }
    const posts = await queryBuilder.getMany();
    const postsWithFavorites = posts.map((post) => {
      const favorited = favoriteIds?.includes(post.id);
      return { ...post, favorited };
    });

    return { posts: postsWithFavorites, postsCount };
  }

  async getFeed(currenUserId: number, query: any): Promise<IPostsResponse> {
    const follows = await this.followRepository.find({
      where: { followerId: currenUserId },
    });
    if (follows.length === 0) {
      return { posts: [], postsCount: 0 };
    }
    const followingUserIds = follows.map((follow) => follow.followingId);
    const queryBuilder = this.dataSourse
      .getRepository(PostEntity)
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.author', 'author')
      .where('posts.authorId IN (:...ids)', { ids: followingUserIds });

    queryBuilder.orderBy('posts.createdAt', 'DESC');

    const postsCount = await queryBuilder.getCount();

    if (query.limit) queryBuilder.limit(query.limit);
    if (query.offset) queryBuilder.offset(query.offset);

    const posts = await queryBuilder.getMany();
    return { posts: posts, postsCount: postsCount };
  }

  async createPost(
    currentUser: UserEntity,
    createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    const post = new PostEntity();
    Object.assign(post, createPostDto);
    if (!post.tagList) post.tagList = [];
    post.slug = 'temp-slug';
    post.author = currentUser;
    const savedPost = await this.postRepository.save(post);
    savedPost.slug = `${slugify(savedPost.title, { lower: true })}-${savedPost.id}`;
    console.log(savedPost.slug);
    return await this.postRepository.save(savedPost);
  }

  bildPostResponse(post: PostEntity): IPostResponse {
    return { post };
  }

  async findBySlug(slug: string): Promise<PostEntity | null> {
    return await this.postRepository.findOne({ where: { slug } });
  }

  async deleteBySlug(
    slug: string,
    currentUserId: number,
  ): Promise<DeleteResult> {
    const post = await this.findBySlug(slug);
    if (!post)
      throw new HttpException('Post does not exist', HttpStatus.NOT_FOUND);
    if (post?.author.id !== currentUserId)
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    return await this.postRepository.delete({ slug });
  }

  async updatePost(
    slug: string,
    updatePostDto: CreatePostDto,
    currentUserId: number,
  ): Promise<PostEntity> {
    const post = await this.findBySlug(slug);
    if (!post)
      throw new HttpException('Post does not exist', HttpStatus.NOT_FOUND);
    if (post?.author.id !== currentUserId)
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    Object.assign(post, updatePostDto);
    return await this.postRepository.save(post);
  }

  async addArticleToFavorites(slug: string, currentUserId: number) {
    const post = await this.findBySlug(slug);
    if (!post) return null;
    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['favorites'],
    });
    const isNotFavorited =
      user?.favorites.findIndex(
        (articleInFavorites) => articleInFavorites.id === post?.id,
      ) === -1;
    if (isNotFavorited) {
      user.favorites.push(post);
      post.favoritesCount++;
      await this.userRepository.save(user);
      await this.postRepository.save(post);

      // Создаём уведомление для автора поста:
      if (post.author.id !== currentUserId) {
        await this.notificationService.createNotification(
          post.author, // пользователь, которому придёт уведомление
          'favorite',
          `Пользователь @${user.username} поставил лайк на ваш пост "${post.title}"`,
        );
      }
    }
    return post;
  }

  async delArticleToFavorites(slug: string, currentUserId: number) {
    const post = await this.findBySlug(slug);
    if (!post) return null;
    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['favorites'],
    });
    if (!user) return null;

    const postIndex = user?.favorites.findIndex(
      (articleInFavorites) => articleInFavorites.id === post?.id,
    );
    if (postIndex != undefined && postIndex >= 0) {
      user.favorites.splice(postIndex, 1);
      post.favoritesCount--;
      await this.userRepository.save(user);
      await this.postRepository.save(post);
    }
    return post;
  }

  async setPostImage(
    slug: string,
    userId: number,
    filePath: string,
  ): Promise<PostEntity> {
    const post = await this.findBySlug(slug);
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    if (post.author.id !== userId) {
      throw new HttpException(
        'Not authorized to update this post',
        HttpStatus.FORBIDDEN,
      );
    }
    post.img = filePath;
    return await this.postRepository.save(post);
  }
}

```

## src\post\types\post-response.interface.ts

```typescript
import { PostEntity } from '../post.entity';

export interface IPostResponse {
  post: PostEntity;
}

```

## src\post\types\post.type.ts

```typescript
import { PostEntity } from '../post.entity';

export type PostType = Omit<PostEntity, 'updateTimeStamp'>;

```

## src\post\types\posts-response.interface.ts

```typescript
import { PostEntity } from '../post.entity';
import { PostType } from './post.type';

export interface IPostsResponse {
  //post: PostEntity;
  posts: PostType[];
  postsCount: number;
}

```

## src\profile\follow.entity.ts

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'follows' })
export class FollowEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  followerId: number;
  @Column()
  followingId: number;
}

```

## src\profile\prifile.module.ts

```typescript
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProflileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserEntity } from 'src/user/user.entity';
import { FollowEntity } from './follow.entity';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, FollowEntity]),
    NotificationModule,
  ],
  controllers: [ProflileController],
  providers: [ProfileService],
})
export class ProfileModule {}

```

## src\profile\profile.controller.ts

```typescript
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/user/decorators/user.decorator';
import { IProfileResponse } from './types/profile-response.interface';
import { ProfileService } from './profile.service';
import { AuthGuard } from 'src/user/guards/auth.guard';

@Controller('profiles')
export class ProflileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getProfile(
    @User('id') currentUserId: number,
    @Param('username') userName: string,
  ): Promise<IProfileResponse> {
    const profile = await this.profileService.getProfile(
      currentUserId,
      userName,
    );
    return this.profileService.buildProfileResponse(profile);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @User('id') currentUserId: number,
    @Param('username') userName: string,
  ): Promise<IProfileResponse> {
    const profile = await this.profileService.followProfile(
      currentUserId,
      userName,
    );
    return this.profileService.buildProfileResponse(profile);
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unFollowProfile(
    @User('id') currentUserId: number,
    @Param('username') userName: string,
  ): Promise<IProfileResponse> {
    const profile = await this.profileService.unFollowProfile(
      currentUserId,
      userName,
    );
    return this.profileService.buildProfileResponse(profile);
  }
}

```

## src\profile\profile.service.ts

```typescript
import { FollowEntity } from './follow.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProfileType } from './types/profile.type';
import { IProfileResponse } from './types/profile-response.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly notificationService: NotificationService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async getProfile(
    currentUserId: number,
    userName: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username: userName },
    });
    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }
    const follow = await this.followRepository.findOne({
      where: { followerId: currentUserId, followingId: user.id },
    });
    return { ...user, following: Boolean(follow) };
  }

  async followProfile(
    currentUserId: number,
    userName: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username: userName },
    });
    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }

    if (currentUserId === user.id) {
      throw new HttpException(
        'Follower and following cant be equal',
        HttpStatus.BAD_REQUEST,
      );
    }

    const follow = await this.followRepository.findOne({
      where: { followerId: currentUserId, followingId: user.id },
    });

    if (!follow) {
      const followToCreate = new FollowEntity();
      followToCreate.followerId = currentUserId;
      followToCreate.followingId = user.id;
      await this.followRepository.save(followToCreate);
    }
    return { ...user, following: true };
  }

  async unFollowProfile(
    currentUserId: number,
    userName: string,
  ): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username: userName },
    });
    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }

    if (currentUserId === user.id) {
      throw new HttpException(
        'Follower and following cant be equal',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Если user.id != currentUserId, то уведомить user
    await this.notificationService.createNotification(
      user, // получает уведомление
      'follow',
      `Пользователь @${user.username} подписался на вас`,
    );

    await this.followRepository.delete({
      followerId: currentUserId,
      followingId: user.id,
    });

    return { ...user, following: false };
  }

  buildProfileResponse(profile: ProfileType): IProfileResponse {
    return { profile };
  }
}

```

## src\profile\types\profile-response.interface.ts

```typescript
import { ProfileType } from './profile.type';

export interface IProfileResponse {
  profile: ProfileType;
}

```

## src\profile\types\profile.type.ts

```typescript
import { UserType } from 'src/user/types/user.type';

export type ProfileType = UserType & { following: boolean };

```

## src\seed.ts

```typescript
// src/seed.ts
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv'; // при необходимости, если нужно чтение .env
import slugify from 'slugify';

// Импортируем сущности (лежат в папках src/user, src/post, src/comment, src/profile)
import { UserEntity } from './user/user.entity';
import { PostEntity } from './post/post.entity';
import { CommentEntity } from './comment/comment.entity';
import { FollowEntity } from './profile/follow.entity';

// ---------- ДАННЫЕ ДЛЯ СИДИРОВАНИЯ (РИЕЛТОРЫ, ТИПЫ НЕДВИЖИМОСТИ И Т.Д.) ----------

const usersData = [
  {
    username: 'andriy.kovalenko',
    email: 'andriy.kovalenko@realtor.ua',
    bio: 'Профессиональный риелтор с 10-летним опытом, работающий в Киеве.',
  },
  {
    username: 'olga.shevchenko',
    email: 'olga.shevchenko@realtor.ua',
    bio: 'Опытный риелтор, специализирующийся на продаже элитной недвижимости во Львове.',
  },
  {
    username: 'mykola.petrenko',
    email: 'mykola.petrenko@realtor.ua',
    bio: 'Риелтор с глубоким знанием рынка жилой и коммерческой недвижимости в Одессе.',
  },
  {
    username: 'svitlana.ivanova',
    email: 'svitlana.ivanova@realtor.ua',
    bio: 'Профессиональный риелтор, консультирующий по вопросам инвестиций в недвижимость в Харькове.',
  },
  {
    username: 'taras.melnyk',
    email: 'taras.melnyk@realtor.ua',
    bio: 'Специалист по продаже квартир и домов, работает в Днепре.',
  },
  {
    username: 'yulia.tkachenko',
    email: 'yulia.tkachenko@realtor.ua',
    bio: 'Риелтор с отличным чувством стиля, помогаю найти идеальное жильё во Львове.',
  },
  {
    username: 'dmytro.hryhorenko',
    email: 'dmytro.hryhorenko@realtor.ua',
    bio: 'Эксперт по коммерческой недвижимости и инвестиционным проектам в Киеве.',
  },
  {
    username: 'natalia.bondarenko',
    email: 'natalia.bondarenko@realtor.ua',
    bio: 'Риелтор с фокусом на элитное жильё и земельные участки в Одессе.',
  },
  {
    username: 'olexandr.koval',
    email: 'olexandr.koval@realtor.ua',
    bio: 'Профессиональный консультант по недвижимости с многолетним опытом в Харькове.',
  },
  {
    username: 'inna.kuzmenko',
    email: 'inna.kuzmenko@realtor.ua',
    bio: 'Специалист по жилой недвижимости, помогаю клиентам найти уютное жильё в Черновцах.',
  },
];

const propertyTypes = [
  'Квартира',
  'Дом',
  'Офис',
  'Коммерческая недвижимость',
  'Земельный участок',
];

const listingCities = [
  'Киев',
  'Львов',
  'Одесса',
  'Харьков',
  'Днепр',
  'Запорожье',
  'Винница',
  'Ивано-Франковск',
  'Черновцы',
  'Полтава',
];

const commentTemplates = [
  'Отличное предложение, очень заинтересован!',
  'Хороший объект, хочу узнать детали.',
  'Можно договориться о просмотре?',
  'Интересное предложение, уточните, пожалуйста, условия сделки.',
  'Объект выглядит привлекательно, жду дополнительной информации.',
  'Спасибо за подробное описание – очень интересно!',
  'Замечательное предложение, рекомендую к просмотру.',
  'Объект вызывает интерес, хочется посмотреть!',
  'Очень качественное предложение, рассмотрю условия.',
  'Прекрасное соотношение цены и качества.',
  'Интересно, когда можно осмотреть объект?',
  'Объект выглядит перспективно, буду рад обсудить условия.',
  'Подробности, пожалуйста, хотелось бы узнать больше.',
  'Отличное предложение, жду звонка.',
  'Рекомендую для тех, кто ищет недвижимость в этом районе.',
  'Хочу получить дополнительную информацию, пожалуйста.',
  'Объект в хорошем состоянии, спасибо за объявление.',
  'Очень понравилось описание, интересно!',
  'Жду возможности обсудить этот объект подробнее.',
  'Объект соответствует моим требованиям, свяжитесь со мной.',
  'Ваше предложение выглядит заманчиво, прошу связаться.',
  'Информация представлена ясно и понятно, спасибо!',
  'Буду рад обсудить детали при личной встрече.',
  'Объект интересен, хотелось бы узнать о дополнительных условиях.',
  'Спасибо за объявление, готов к просмотру в удобное время.',
];

// ---------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ СЛУЧАЙНОСТИ ----------

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ---------- ФУНКЦИЯ ДЛЯ СОЗДАНИЯ ПРАВИЛЬНЫХ НАСТРОЕК DataSourceOptions ----------

function dataSourceOptionsFactory(
  configService: ConfigService,
): DataSourceOptions {
  return {
    // Обязательно укажите правильный type
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: +configService.get<string>('DB_PORT', '5432'),
    username: configService.get<string>(
      'DB_USERNAME',
      'panchenkowork_postgres',
    ),
    password: configService.get<string>('DB_PASSWORD', '36355693801'),
    database: configService.get<string>('DB_NAME', 'panchenkowork_db'),
    // Путь к сущностям
    entities: [__dirname + '/**/*.entity.{ts,js}'],
    // На dev-среде можно оставить true
    synchronize: true,
  };
}

// ---------- ГЛАВНАЯ ФУНКЦИЯ SEED ----------

async function seed() {
  try {
    // Загружаем .env при необходимости
    config();

    // Создаём ConfigService, чтобы брать переменные окружения
    const configService = new ConfigService();

    // Формируем DataSourceOptions (для "typeorm": ^0.3.x)
    const dataSourceOptions = dataSourceOptionsFactory(configService);

    // Создаём DataSource и инициализируем
    const dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    // Получаем репозитории
    const userRepository = dataSource.getRepository(UserEntity);
    const postRepository = dataSource.getRepository(PostEntity);
    const commentRepository = dataSource.getRepository(CommentEntity);
    const followRepository = dataSource.getRepository(FollowEntity);

    // ---------- 1. Создаём 10 риелторов ----------
    const users: UserEntity[] = [];
    for (let i = 0; i < usersData.length; i++) {
      const data = usersData[i];
      const user = new UserEntity();
      user.username = data.username;
      user.email = data.email;
      user.bio = data.bio;
      // Аватар в формате "номер.jpg"
      user.img = `uploads/avatars/${i + 1}.jpg`;
      // Пароль будет захеширован благодаря @BeforeInsert
      user.password = 'password123';
      const savedUser = await userRepository.save(user);
      // Инициализируем favorites (лайки)
      (savedUser as any).favorites = [];
      users.push(savedUser);
    }
    console.log(
      'Созданы риелторы:',
      users.map((u) => u.username),
    );

    // ---------- 2. Создаём 10 объектов на каждого риелтора ----------
    const posts: PostEntity[] = [];
    let globalPostCounter = 1;
    for (const user of users) {
      for (let i = 1; i <= 10; i++) {
        const post = new PostEntity();
        const propertyType = randomElement(propertyTypes);
        const city = randomElement(listingCities);

        post.title = `Продажа ${propertyType} в ${city} – Объект №${i} от ${user.username}`;
        const area = randomInt(30, 150);
        const price = randomInt(50000, 300000);
        post.content = `Предлагается ${propertyType.toLowerCase()} площадью ${area} кв.м в ${city}. Цена: ${price} USD. Обращайтесь к ${user.username}.`;

        // Картинка в формате "номер.jpg"
        post.img = `uploads/posts/${globalPostCounter}.jpg`;
        globalPostCounter++;

        post.tagList = [
          propertyType.toLowerCase(),
          'недвижимость',
          city.toLowerCase(),
        ];
        post.favoritesCount = 0;
        post.author = user;
        post.slug = 'temp-slug'; // временно

        let savedPost = await postRepository.save(post);
        // Генерируем slug на основе title + id
        savedPost.slug = `${slugify(savedPost.title, { lower: true })}-${savedPost.id}`;
        savedPost = await postRepository.save(savedPost);
        posts.push(savedPost);
      }
    }
    console.log(`Созданы объекты недвижимости, всего: ${posts.length}`);

    // ---------- 3. Проставляем лайки (3–7 лайков на пост) ----------
    for (const post of posts) {
      const potentialLikers = users.filter((u) => u.id !== post.author.id);
      const numLikes = randomInt(3, Math.min(7, potentialLikers.length));
      const shuffled = potentialLikers.sort(() => 0.5 - Math.random());
      const selectedLikers = shuffled.slice(0, numLikes);

      for (const liker of selectedLikers) {
        (liker as any).favorites.push(post);
        await userRepository.save(liker);
      }

      post.favoritesCount = selectedLikers.length;
      await postRepository.save(post);
    }
    console.log('Лайки проставлены');

    // ---------- 4. Добавляем комментарии (3–5 на пост, итого > 100) ----------
    for (const post of posts) {
      const numComments = randomInt(3, 5);
      for (let j = 1; j <= numComments; j++) {
        const comment = new CommentEntity();
        const template = randomElement(commentTemplates);
        comment.body = `${template} [Комментарий №${j} к "${post.title}"]`;
        // Выбираем автора комментария (не автор поста)
        const potentialCommenters = users.filter(
          (u) => u.id !== post.author.id,
        );
        comment.author = randomElement(potentialCommenters);
        comment.post = post;
        await commentRepository.save(comment);
      }
    }
    console.log('Комментарии добавлены');

    // ---------- 5. Подписки (2–4 на пользователя) ----------
    for (const user of users) {
      const potentialFollows = users.filter((u) => u.id !== user.id);
      const numFollows = randomInt(2, 4);
      const shuffled = potentialFollows.sort(() => 0.5 - Math.random());
      const followsToCreate = shuffled.slice(0, numFollows);

      for (const target of followsToCreate) {
        const follow = new FollowEntity();
        follow.followerId = user.id;
        follow.followingId = target.id;
        await followRepository.save(follow);
      }
    }
    console.log('Подписки созданы');

    console.log('Скрипт заполнения базы тестовыми данными выполнен успешно!');
    process.exit(0);
  } catch (error) {
    console.error('Ошибка при заполнении базы данных:', error);
    process.exit(1);
  }
}

// Запуск сидирования
seed();

```

## src\types\express-request.interface.ts

```typescript
import { UserEntity } from './../user/user.entity';
import { Request } from 'express';

export interface IExpressRequest extends Request {
  user?: UserEntity;
}

```

## src\user\decorators\user.decorator.ts

```typescript
import { IExpressRequest } from './../../types/express-request.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<IExpressRequest>();
  if (!request.user) {
    return null;
  }
  if (data) {
    return request.user[data];
  }
  return request.user;
});

```

## src\user\dto\create-user.dto.ts

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'john_doe',
  })
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'john@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'Пароль для пользователя',
    example: 'P@ssw0rd123',
  })
  @IsNotEmpty()
  readonly password: string;

  readonly img: string;
  readonly bio: string;
}

```

## src\user\dto\login-user.dto.ts

```typescript
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly password: string;
}

```

## src\user\dto\update-user.dto.ts

```typescript
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  readonly img: string;
  readonly bio: string;
}

```

## src\user\guards\auth.guard.ts

```typescript
import { IExpressRequest } from './../../types/express-request.interface';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<IExpressRequest>();
    if (request.user) {
      return true;
    }
    throw new HttpException('User not authorized', HttpStatus.UNAUTHORIZED);
  }
}

```

## src\user\middlewares\auth.middleware.ts

```typescript
import { UserService } from './../user.service';
// import { JWT_SECRET } from './../../config';
import { IExpressRequest } from './../../types/express-request.interface';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}
  async use(req: IExpressRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = undefined;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];
    const jwtSecret = this.configService.get<string>(
      'JWT_SECRET',
      'JWT_SECRET',
    );

    try {
      const decode = verify(token, jwtSecret) as JwtPayload;
      const user = await this.userService.findById(decode.id);
      if (user) req.user = user;
      else req.user = undefined;
      next();
    } catch (error) {
      console.error('Token validation error:', error);
      req.user = undefined;
      next();
    }
  }
}

```

## src\user\types\user-response.interface.ts

```typescript
import { UserEntity } from './../user.entity';
import { UserType } from './user.type';

export interface IUserResponse {
  user: UserType & { token: string };
}

```

## src\user\types\user.type.ts

```typescript
import { UserEntity } from './../user.entity';

// export type UserType = Omit<UserEntity, 'hashPassword'>;

export type UserType = Omit<UserEntity, 'password' | 'hashPassword'>;

```

## src\user\user.controller.ts

```typescript
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from './decorators/user.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { IUserResponse } from './types/user-response.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserEntity } from './user.entity';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Users')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('users')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Создание нового пользователя' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан.' })
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<IUserResponse> {
    return await this.userService.login(loginUserDto);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  currentUser(@User() user: UserEntity): IUserResponse {
    if (!user) {
      throw new HttpException('User not authorized', HttpStatus.UNAUTHORIZED);
    }
    return this.userService.buildUserResponse(user);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateCurrentUser(
    @User('id') currentUserId: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.updateUser(
      currentUserId,
      updateUserDto,
    );
    return this.userService.buildUserResponse(user);
  }

  @Get('users/search')
  async searchUsers(@Query('username') username: string) {
    // Можно искать по логину или части логина
    const results = await this.userService.searchByUsername(username);
    return { users: results };
  }

  @Post('user/avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/avatars',
      filename: (req, file, callback) => {
        // Генерируем уникальное имя файла: userID + timestamp + расширение
        const ext = extname(file.originalname); // например .png
        const fileName = `avatar_${Date.now()}${ext}`;
        callback(null, fileName);
      },
    }),
    limits: { fileSize: 2 * 1024 * 1024 }, // ограничение ~2MB
  }))
  async uploadAvatar(
    @User() currentUser: UserEntity,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Пример: путь к файлу
    const filePath = `uploads/avatars/${file.filename}`;

    // Сохраняем ссылку на аватар в поле user.img
    const updatedUser = await this.userService.setUserAvatar(currentUser.id, filePath);

    // Возвращаем обновлённые данные пользователя
    return this.userService.buildUserResponse(updatedUser);
  }

}

```

## src\user\user.entity.ts

```typescript
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
import { PostEntity } from 'src/post/post.entity';
import { CommentEntity } from 'src/comment/comment.entity';
import { NotificationEntity } from 'src/notification/notification.entity';
// import { PostEntity } from '@app/';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  email: string;
  @Column({ unique: true })
  username: string;
  @Column({ default: '' })
  bio: string;
  @Column({ default: '' })
  img: string;
  @Column({ select: false })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  @OneToMany(() => PostEntity, (post) => post.author)
  posts: PostEntity[];

  @ManyToMany(() => PostEntity)
  @JoinTable()
  favorites: PostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.author)
  comments: CommentEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.user, {
    cascade: true,
  })
  notifications: NotificationEntity[];
}

```

## src\user\user.module.ts

```typescript
import { AuthGuard } from './guards/auth.guard';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';

@Module({
  controllers: [UserController],
  providers: [UserService, AuthGuard],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: [UserService],
})
export class UserModule {}

```

## src\user\user.service.ts

```typescript
import { UpdateUserDto } from './dto/update-user.dto';
import { UserType } from './types/user.type';
import { LoginUserDto } from './dto/login-user.dto';
import { IUserResponse } from './types/user-response.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    const userByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    const userByUserName = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (userByEmail || userByUserName) {
      throw new HttpException(
        'Email or username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  generateJwt(user: UserEntity) {
    const jwtSecret = this.configService.get<string>(
      'JWT_SECRET',
      'JWT_SECRET',
    );

    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      jwtSecret,
      { expiresIn: '1d' },
    );
  }

  buildUserResponse(user: UserEntity): IUserResponse {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<IUserResponse> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
      select: ['bio', 'email', 'password', 'username', 'id', 'img'],
    });

    if (!user) {
      throw new HttpException(
        'Incorrect credentials!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordCorrect = await compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Incorrect credentials!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const { password, ...userWithoutPassword } = user;
    return this.buildUserResponse(userWithoutPassword as UserEntity);
  }

  async findById(id: number): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async searchByUsername(username: string): Promise<UserEntity[]> {
    if (!username) return [];
    return this.userRepository.find({
      where: { username: ILike(`%${username}%`) }, // ILike - если нужен case-insensitive поиск
      take: 20,
    });
  }

  async setUserAvatar(userId: number, avatarPath: string): Promise<UserEntity> {
    const user = await this.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    user.img = avatarPath;
    return await this.userRepository.save(user);
  }
}

```

## test\app.e2e-spec.ts

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});

```

# Дополнительные файлы

⚠️ Файл **index.html** не найден и пропущен.

