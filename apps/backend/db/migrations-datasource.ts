import { loadEnvs, requireEnv } from '../src/utils/helpers';
import { DataSource } from 'typeorm';

loadEnvs();

const databaseUrl = requireEnv('DATABASE_URL');

export default new DataSource({
  type: 'postgres',
  url: databaseUrl,
  migrations: ['db/migrations/*.ts'],
  synchronize: false,
  logger: 'simple-console',
});
