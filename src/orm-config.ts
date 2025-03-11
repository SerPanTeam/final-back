import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const ormConfigFactory = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  // Если переменная окружения отсутствует, будет использовано значение '5432'
  port: +configService.get<string>('DB_PORT', '5432'),
  username: configService.get<string>('DB_USERNAME', 'panchenkowork_postgres'),
  password: configService.get<string>('DB_PASSWORD', '36355693801'),
  database: configService.get<string>('DB_NAME', 'panchenkowork_db'),
  entities: [__dirname + '/**/*.entity.{ts,js}'],
  synchronize: true, // для production лучше отключить
});

// import { DataSourceOptions } from 'typeorm';

// const config: DataSourceOptions = {
//   type: 'postgres',

//   host: 'localhost',
//   port: 5432,
//   username: 'postgres',
//   password: '36355693801',
//   database: 'db',

//   entities: [__dirname + '/**/*.entity.{ts,js}'], // ✅ Исправленный путь
//   synchronize: true,
// };

// export default config;
