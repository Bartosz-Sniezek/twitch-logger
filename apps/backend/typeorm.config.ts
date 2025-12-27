import { loadEnvs, requireEnv } from 'src/utils/helpers';
import { DataSource } from 'typeorm';

loadEnvs();
const databaseUrl = requireEnv('PG_DATABASE_URL');

export default new DataSource({
  type: 'postgres',
  url: databaseUrl,
  migrations: ['db/migrations/*.ts'],
  synchronize: false,
});
