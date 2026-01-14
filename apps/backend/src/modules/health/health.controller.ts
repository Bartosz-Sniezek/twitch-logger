import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { KeyvRedisHealthIndicator } from './keyv-redis.health';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly keyvRedis: KeyvRedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async get() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.keyvRedis.isHealthy('keyv-redis'),
      () => this.memory.checkHeap('memory_heap', 256 * 1024 * 1024),
    ]);
  }
}
