import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { MessageEntity } from './message.entity';
import { User } from 'src/user/decorators/user.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('rooms/:roomId/messages')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Получить все сообщения из конкретной комнаты' })
  @ApiResponse({
    status: 200,
    description: 'Сообщения успешно получены',
    type: [MessageEntity],
  })
  async getMessagesByRoom(
    @Param('roomId') roomId: string,
  ): Promise<MessageEntity[]> {
    return this.chatService.getMessagesByRoom(roomId);
  }

  @Get('messages')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Получить все сообщения (без фильтра по roomId)' })
  @ApiResponse({
    status: 200,
    description: 'Все сообщения успешно получены',
    type: [MessageEntity],
  })
  async getAllMessages(): Promise<MessageEntity[]> {
    return this.chatService.getAllMessages();
  }

  /**
   * Новый endpoint для получения списка последних переписок.
   */
  @Get('conversations')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Получить список последних переписок' })
  @ApiResponse({
    status: 200,
    description: 'Список переписок успешно получен',
  })
  async getLastConversations(@User('id') userId: number): Promise<any[]> {
    return this.chatService.getLastConversations(userId);
  }
}
