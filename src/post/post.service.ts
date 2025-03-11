import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { IPostResponse } from './types/post-response.interface';
import slugify from 'slugify';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}
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
      throw new HttpException('You are not a author', HttpStatus.FORBIDDEN);
    return await this.postRepository.delete({ slug });
  }
}
