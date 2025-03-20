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
import { CommentEntity } from 'src/comment/comment.entity';
import { NotificationEntity } from 'src/notification/notification.entity';
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
  @JoinTable({
    name: 'users_favorites_posts', // название таблицы, где хранится связь
    joinColumn: { name: 'userid', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'postid', referencedColumnName: 'id' },
  })
  favorites: PostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.author)
  comments: CommentEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.user, {
    cascade: true,
  })
  notifications: NotificationEntity[];
}
