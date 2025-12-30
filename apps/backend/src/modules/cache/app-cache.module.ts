import KeyvRedis from '@keyv/redis';
import { AppConfigModule } from '@modules/app-config/app-config.module';
import { AppConfig } from '@modules/app-config/app-env-configuration';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { AppCacheService } from './app-cache.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfig],
      useFactory: async (config: AppConfig) => {
        return {
          stores: [new KeyvRedis(config.values.REDIS_URL)],
        };
      },
    }),
  ],
  providers: [AppCacheService],
  exports: [AppCacheService],
})
export class AppCacheModule {}
