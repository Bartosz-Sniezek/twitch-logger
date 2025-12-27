import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Environment, getEnvPath } from '@utils/helpers';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: (() => {
        const envPath = getEnvPath();

        return envPath ?? undefined;
      })(),
      validationSchema: Joi.object({
        PORT: Joi.number(),
        NODE_ENV: Joi.string().valid(
          Environment.DEVELOPMENT,
          Environment.TEST,
          Environment.PRODUCTION,
        ),
        DATABASE_URL: Joi.string(),
      }),
      isGlobal: true,
    }),
  ],
})
export class ConfigurationModule {}
