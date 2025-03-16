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
