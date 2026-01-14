import { Module } from '@nestjs/common';
import { AppConfigModule } from '@modules/app-config/app-config.module';
import { DatabaseModule } from '@modules/database/database.module';
import { TwitchModule } from '@modules/twitch/twitch.module';
import { HealthModule } from '@modules/health/health.module';

@Module({
  imports: [AppConfigModule, HealthModule, DatabaseModule, TwitchModule],
})
export class AppModule {}
