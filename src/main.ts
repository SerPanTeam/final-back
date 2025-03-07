// if (!process.env.IS_TS_NODE) {
//   require('module-alias/register');
// }

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('Final project API')
    .setDescription('Project API documentation')
    .setVersion('1.0')
    .addBearerAuth() // Если используется JWT-авторизация
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
