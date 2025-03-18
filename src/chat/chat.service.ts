import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from './message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async getMessagesByRoom(roomId: string): Promise<MessageEntity[]> {
    return this.messageRepository.find({
      where: { roomId },
      order: { createdAt: 'ASC' },
    });
  }

  async getAllMessages(): Promise<MessageEntity[]> {
    return this.messageRepository.find({
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * Метод возвращает список последних переписок для текущего пользователя.
   * Для каждого уникального roomId выбирается последнее (самое новое) сообщение,
   * после чего определяется собеседник (otherUser) – если текущий пользователь является отправителем,
   * то собеседником является получатель, иначе – отправитель.
   *
   * Возвращаемый объект имеет следующую структуру:
   * {
   *   roomId: string,
   *   lastMessage: { id, content, createdAt },
   *   otherUser: { id, username, img }
   * }
   */
  async getLastConversations(userId: number): Promise<any[]> {
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.recipient', 'recipient')
      .where('sender.id = :userId OR recipient.id = :userId', { userId })
      .orderBy('message.createdAt', 'DESC')
      .getMany();

    // Группируем сообщения по roomId (берем первое, т.е. самое новое сообщение для каждой комнаты)
    const conversationsMap: { [roomId: string]: MessageEntity } = {};
    messages.forEach((msg) => {
      if (!conversationsMap[msg.roomId]) {
        conversationsMap[msg.roomId] = msg;
      }
    });

    // Преобразуем группы в массив и сортируем по дате последнего сообщения
    const conversations = Object.values(conversationsMap).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Формируем DTO для фронтенда
    return conversations.map((msg) => {
      const otherUser = msg.sender.id === userId ? msg.recipient : msg.sender;
      return {
        roomId: msg.roomId,
        lastMessage: {
          id: msg.id,
          content: msg.content,
          createdAt: msg.createdAt,
        },
        otherUser: {
          id: otherUser.id,
          username: otherUser.username,
          img: otherUser.img,
        },
      };
    });
  }
}
