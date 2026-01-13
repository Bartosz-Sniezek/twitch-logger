import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from '@modules/app-config/app-env-configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfig);
  app.enableCors({
    origin: config.allowedOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  await app.listen(config.values.PORT);
}
bootstrap()
  .then()
  .catch((e) => {
    throw e;
  });
