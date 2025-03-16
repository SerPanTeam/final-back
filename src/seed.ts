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
