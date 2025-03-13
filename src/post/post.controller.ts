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
