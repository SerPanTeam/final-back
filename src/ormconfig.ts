import { DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '36355693801',
  database: 'db',
  // entities: [__dirname + '/**/*.entity{.ts, .js}'],
  entities: [__dirname + '/**/*.entity.{ts,js}'], // ✅ Исправленный путь

  synchronize: true,
  // migrations: [__dirname + '/migrations/**/*{.tj, .js}'],
};

export default config;
