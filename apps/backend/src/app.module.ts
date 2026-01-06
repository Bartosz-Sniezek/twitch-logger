import { Module } from '@nestjs/common';
import { AppConfigModule } from '@modules/app-config/app-config.module';
import { DatabaseModule } from '@modules/database/database.module';
import { TwitchModule } from '@modules/twitch/twitch.module';
import { UserTwitchChannelsModule } from '@modules/user-twitch-channels/user-twitch-channels.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    TwitchModule,
    UserTwitchChannelsModule,
  ],
})
export class AppModule {}
