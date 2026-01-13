import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from '@modules/app-config/app-env-configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfig);
  app.enableCors({
    origin: config.allowedOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Twitch channels logger')
    .setVersion('0.1')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(config.values.PORT);
}
bootstrap()
  .then()
  .catch((e) => {
    throw e;
  });
