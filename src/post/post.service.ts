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
    // console.log(favoriteIds);
    const posts = await queryBuilder.getMany();
    const postsWithFavorites = posts.map((post) => {
      const favorited = favoriteIds?.includes(post.id);
      return { ...post, favorited };
    });

    return { posts: postsWithFavorites, postsCount };
  }

  // async getFeed(currenUserId: number, query: any): Promise<IPostsResponse> {
  //   const follows = await this.followRepository.find({
  //     where: { followerId: currenUserId },
  //   });
  //   if (follows.length === 0) {
  //     return { posts: [], postsCount: 0 };
  //   }
  //   const followingUserIds = follows.map((follow) => follow.followingId);
  //   const queryBuilder = this.dataSourse
  //     .getRepository(PostEntity)
  //     .createQueryBuilder('posts')
  //     .leftJoinAndSelect('posts.author', 'author')
  //     .where('posts.authorId IN (:...ids)', { ids: followingUserIds });

  //   queryBuilder.orderBy('posts.createdAt', 'DESC');

  //   const postsCount = await queryBuilder.getCount();

  //   if (query.limit) queryBuilder.limit(query.limit);
  //   if (query.offset) queryBuilder.offset(query.offset);

  //   const posts = await queryBuilder.getMany();
  //   return { posts: posts, postsCount: postsCount };
  // }

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
      .where('posts.authorId IN (:...ids)', { ids: followingUserIds })
      .orderBy('posts.createdAt', 'DESC');

    const postsCount = await queryBuilder.getCount();
    if (query.limit) queryBuilder.limit(query.limit);
    if (query.offset) queryBuilder.offset(query.offset);

    const posts = await queryBuilder.getMany();

    // ТА САМАЯ ЛОГИКА: для выставления favorited
    let favoriteIds: number[] | undefined = [];
    if (currenUserId) {
      const currentUser = await this.userRepository.findOne({
        where: { id: currenUserId },
        relations: ['favorites'],
      });
      favoriteIds = currentUser?.favorites.map((fav) => fav.id);
    }
    const postsWithFavorites = posts.map((post) => {
      const favorited = favoriteIds?.includes(post.id);
      return { ...post, favorited };
    });

    return { posts: postsWithFavorites, postsCount };
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

  // bildPostResponse(post: PostEntity): IPostResponse {
  //   return { post };
  // }

  async bildPostResponse(
    post: PostEntity,
    currentUserId?: number,
  ): Promise<IPostResponse> {
    let favorited = false;
    if (currentUserId) {
      const currentUser = await this.userRepository.findOne({
        where: { id: currentUserId },
        relations: ['favorites'],
      });
      favorited =
        currentUser?.favorites.some((fav) => fav.id === post.id) || false;
    }
    // Добавляем свойство favorited непосредственно в экземпляр post и приводим тип
    (post as PostEntity & { favorited: boolean }).favorited = favorited;
    return { post: post as PostEntity & { favorited: boolean } };
  }

  async findBySlug(slug: string): Promise<PostEntity | null> {
    const post = await this.postRepository.findOne({ where: { slug } });
    if (post)
      post.comments.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      );

    return post;
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
          post.author, // получатель уведомления – автор поста
          user, // инициатор – текущий пользователь, который поставил лайк
          'favorite',
          `User @${user.username}  has liked your post "${post.title}"`,
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

  async getPostStats(
    slug: string,
  ): Promise<{ likes: number; comments: number }> {
    const post = await this.findBySlug(slug);
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    const likes = post.favoritesCount;
    // Если комментарии загружаются eagerly – просто возвращаем длину массива
    const comments = post.comments ? post.comments.length : 0;
    return { likes, comments };
  }

  async checkIfFavorited(userId: number, postId: number): Promise<boolean> {
    // const user = await this.userRepository.findOne({
    //   where: { id: userId },
    //   relations: ['favorites'],
    // });
    // if (!user) {
    //   throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    // }
    // return user.favorites.some((favorite) => favorite.id === postId);

    const result = await this.userRepository
      .createQueryBuilder('user') // Создаем запрос, называя основную сущность "user"
      .leftJoinAndSelect('user.favorites', 'favorite') // Выполняем левое соединение с таблицей "favorites" и называем её "favorite"
      .where('user.id = :userId', { userId }) // Указываем условие на ID пользователя
      .andWhere('favorite.id = :postId', { postId }) // Указываем дополнительное условие на ID поста
      .getOne(); // Получаем одну запись, соответствующую условиям

    console.log('QueryBuilder result:', result); // Логируем результат
    return !!result; // Возвращаем булево значение: true, если запись найдена, иначе false
  }
}
