import { Module } from '@nestjs/common';
import { AppConfigModule } from '@modules/app-config/app-config.module';
import { DatabaseModule } from '@modules/database/database.module';
import { TwitchModule } from '@modules/twitch/twitch.module';

@Module({
  imports: [AppConfigModule, DatabaseModule, TwitchModule],
})
export class AppModule {}
