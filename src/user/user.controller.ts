import { IExpressRequest } from './../types/express-request.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { IUserResponse } from './types/user-response.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('users')
  @UsePipes(new ValidationPipe())
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
    // const user = await this.userService.login(loginUserDto);
    //return user;
    // return this.userService.buildUserResponce({ ...user });
    return await this.userService.login(loginUserDto);
  }

  @Get('user')
  async currentUser(@Req() request: IExpressRequest): Promise<IUserResponse> {
    if (!request.user) {
      throw new HttpException(
        'Пользователь не авторизован',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.userService.buildUserResponse(request.user);
  }
}
