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
   * после чего определяется собеседник: если текущий пользователь является отправителем,
   * то собеседником является получатель, иначе — отправитель.
   */
  async getLastConversations(userId: number): Promise<any[]> {
    // Используем QueryBuilder для выборки сообщений с нужными связями и сортировкой
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.recipient', 'recipient')
      .where('sender.id = :userId OR recipient.id = :userId', { userId })
      .orderBy('message.createdAt', 'DESC')
      .getMany();

    // Группируем сообщения по roomId – первое (самое новое) сообщение в каждой группе
    const conversationsMap: { [roomId: string]: MessageEntity } = {};
    messages.forEach((msg) => {
      if (!conversationsMap[msg.roomId]) {
        conversationsMap[msg.roomId] = msg;
      }
    });

    // Преобразуем объект группировки в массив и сортируем по дате последнего сообщения
    const conversations = Object.values(conversationsMap).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Формируем DTO для фронтенда
    const conversationDtos = conversations.map((msg) => {
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

    return conversationDtos;
  }
}
