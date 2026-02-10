import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from '@utils/helpers';
import z from 'zod';

const appConfigSchema = z.object({
  PORT: z.coerce.number(),
  ALLOWED_ORIGINS: z.string(),
  NODE_ENV: z.enum(Environment),
  DATABASE_URL: z.string(),
  TWITCH_API_CLIENT_ID: z.string(),
  TWITCH_API_CLIENT_PASSWORD: z.string(),
  REDIS_URL: z.string(),
  KAFKA_BROKER: z.string(),
});

export type AppEnvConfig = z.infer<typeof appConfigSchema>;

const schemaKeys = Object.keys(appConfigSchema.shape) as Array<
  keyof AppEnvConfig
>;

@Injectable()
export class AppConfig {
  private readonly _values: AppEnvConfig;

  constructor(configService: ConfigService) {
    this._values = appConfigSchema.parse(
      Object.fromEntries(
        schemaKeys.map((key) => [key, configService.get(key)]),
      ),
    );
  }

  get values(): AppEnvConfig {
    return { ...this._values };
  }

  get allowedOrigin(): string[] {
    return this.values.ALLOWED_ORIGINS.split(';');
  }
}
