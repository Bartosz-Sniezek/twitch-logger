import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from '@utils/helpers';
import { AppConfig } from './app-env-configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: (() => {
        const envPath = getEnvPath();

        return envPath ?? undefined;
      })(),
      isGlobal: true,
    }),
  ],
  providers: [AppConfig],
  exports: [AppConfig],
})
export class AppConfigModule {}
