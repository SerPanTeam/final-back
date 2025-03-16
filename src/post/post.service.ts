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
