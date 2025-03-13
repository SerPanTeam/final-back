# Структура проекта

```plaintext
├── src
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
│   ├── tag
│   │   ├── tag.controller.ts
│   │   ├── tag.entity.ts
│   │   ├── tag.module.ts
│   │   └── tag.service.ts
│   ├── types
│   │   └── express-request.interface.ts
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
│   └── orm-config.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
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
import { TagModule } from './tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfigFactory } from './orm-config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProfileModule } from './profile/prifile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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

## src\config.ts

```typescript
// export const JWT_SECRET = 'JWT_SECRET';

```

## src\main.ts

```typescript
// if (!process.env.IS_TS_NODE) {
//   require('module-alias/register');
// }

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('Final project API')
    .setDescription('Project API documentation')
    .setVersion('1.0')
    .addBearerAuth() // Если используется JWT-авторизация
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

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
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from 'src/user/decorators/user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { IPostResponse } from './types/post-response.interface';
import { IPostsResponse } from './types/posts-response.interface';

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
}

```

## src\post\post.entity.ts

```typescript
import { UserEntity } from 'src/user/user.entity';
import {
  AfterInsert,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
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

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [TypeOrmModule.forFeature([PostEntity, UserEntity, FollowEntity])],
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

@Injectable()
export class PostService {
  constructor(
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

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FollowEntity])],
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

@Injectable()
export class ProfileService {
  constructor(
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

## src\tag\tag.controller.ts

```typescript
import { TagService } from './tag.service';
import { Controller, Get } from '@nestjs/common';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}
  @Get()
  async findall() {
    const tags = await this.tagService.findAll();
    return {
      tags: tags.map((tag) => tag.name),
    };
  }
}

```

## src\tag\tag.entity.ts

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tags' })
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

```

## src\tag\tag.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from './tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}

```

## src\tag\tag.service.ts

```typescript
import { Injectable } from '@nestjs/common';
import { TagEntity } from './tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}
  async findAll(): Promise<TagEntity[]> {
    return await this.tagRepository.find();
  }
}

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
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserEntity } from './user.entity';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  async currentUser(@User() user: UserEntity): Promise<IUserResponse> {
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
import { Repository } from 'typeorm';
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

