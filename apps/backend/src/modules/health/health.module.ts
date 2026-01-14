import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { KeyvRedisHealthIndicator } from './keyv-redis.health';
import { AppCacheModule } from '@modules/cache/app-cache.module';

@Module({
  imports: [AppCacheModule, TerminusModule],
  controllers: [HealthController],
  providers: [KeyvRedisHealthIndicator],
})
export class HealthModule {}
