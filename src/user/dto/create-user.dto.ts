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
