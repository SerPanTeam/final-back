import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from './message.entity';
import { UserEntity } from 'src/user/user.entity';

@WebSocketGateway({
  cors: {
    origin: '*', // при необходимости укажите конкретные адреса (например, http://localhost:3000)
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Клиент вызывает событие 'joinRoom', передавая { roomId },
   * чтобы «зайти» в комнату.
   */
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = data;
    // «Подписываем» сокет на комнату roomId
    client.join(roomId);

    // (опционально) отправляем уведомление о том, что клиент успешно вошёл в комнату
    client.emit('joinedRoom', { roomId });
  }

  /**
   * Клиент вызывает событие 'sendMessage', передавая в data:
   *  - roomId: string
   *  - senderId: number
   *  - recipientId: number
   *  - content: string
   *  - clientMessageId?: string (опционально, если хотим избежать дубликатов на фронте)
   */
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    data: {
      roomId: string;
      senderId: number;
      recipientId: number;
      content: string;
      clientMessageId?: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // 1. Находим пользователей в базе данных
      const sender = await this.userRepository.findOne({
        where: { id: data.senderId },
      });
      const recipient = await this.userRepository.findOne({
        where: { id: data.recipientId },
      });

      // Если кого-то из пользователей нет — ошибка
      if (!sender || !recipient) {
        client.emit('messageError', {
          error: 'Sender or recipient not found',
          senderId: data.senderId,
          recipientId: data.recipientId,
          clientMessageId: data.clientMessageId, // отправляем обратно clientMessageId, чтобы фронт знал, какое сообщение не доставлено
        });
        return;
      }

      // 2. Создаём и сохраняем сообщение
      const message = new MessageEntity();
      message.roomId = data.roomId;
      message.content = data.content;
      message.sender = sender;
      message.recipient = recipient;

      const savedMessage = await this.messageRepository.save(message);

      // 3. Отправляем обратно событие receiveMessage всем подписанным на roomId
      this.server.to(data.roomId).emit('receiveMessage', {
        id: savedMessage.id,
        content: savedMessage.content,
        senderId: sender.id,
        recipientId: recipient.id,
        roomId: data.roomId,
        createdAt: savedMessage.createdAt,
        clientMessageId: data.clientMessageId, // возвращаем clientMessageId, чтобы фронт мог сопоставить
      });
    } catch (error) {
      console.error('Error saving message:', error);
      client.emit('messageError', {
        error: 'Failed to save message',
        clientMessageId: data.clientMessageId,
      });
    }
  }

  /**
   * (Опционально) История сообщений:
   * Клиент вызывает событие 'getMessageHistory', передавая { roomId },
   * чтобы запросить все сообщения в данной комнате.
   */
  @SubscribeMessage('getMessageHistory')
  async handleGetMessageHistory(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const messages = await this.messageRepository.find({
        where: { roomId: data.roomId },
        order: { createdAt: 'ASC' },
      });

      // Отправляем историю сообщений конкретно тому клиенту, который запросил
      client.emit('messageHistory', {
        roomId: data.roomId,
        messages,
      });
    } catch (error) {
      console.error('Error fetching message history:', error);
      client.emit('messageError', { error: 'Failed to fetch message history' });
    }
  }
}
