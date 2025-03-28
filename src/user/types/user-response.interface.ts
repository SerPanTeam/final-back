import { UserEntity } from './../user.entity';
import { UserType } from './user.type';

export interface IUserResponse {
  user: UserType & { token: string };
}
