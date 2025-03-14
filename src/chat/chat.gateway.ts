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
    origin: '*', // при необходимости указать конкретные адреса
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  // Пользователь (клиент) вызывает событие 'joinRoom' и передаёт ID комнаты, чтобы "зайти" в неё
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = data;
    client.join(roomId);
    client.emit('joinedRoom', { roomId });
  }

  // Отправка сообщения: клиент вызывает 'sendMessage' и передаёт roomId, senderId, recipientId, content
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    data: {
      roomId: string;
      senderId: number;
      recipientId: number;
      content: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    // 1. Сохраняем сообщение в БД (если нужно)
    const message = new MessageEntity();
    message.content = data.content;
    // Здесь вам надо найти UserEntity по ID
    // Но для упрощения примера пропустим детализацию. Если очень нужно:
    // const sender = await this.userRepository.findOne({ where: { id: data.senderId } });
    // const recipient = await this.userRepository.findOne({ where: { id: data.recipientId } });
    // message.sender = sender;
    // message.recipient = recipient;

    // Если у вас нет userRepository, можно сохранить чисто ID, но тогда нужна дополнительная логика
    // Или сделаем так (будет ошибка, если юзера не найдёт):
    const sender = new UserEntity();
    sender.id = data.senderId;
    message.sender = sender;

    const recipient = new UserEntity();
    recipient.id = data.recipientId;
    message.recipient = recipient;

    await this.messageRepository.save(message);

    // 2. Отправляем (broadcast) это сообщение в комнату roomId
    this.server.to(data.roomId).emit('receiveMessage', {
      id: message.id,
      content: message.content,
      senderId: data.senderId,
      recipientId: data.recipientId,
      createdAt: message.createdAt,
    });
  }
}
