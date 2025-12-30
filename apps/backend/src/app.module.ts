import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from '@modules/app-config/app-config.module';
import { DatabaseModule } from '@modules/database/database.module';
import { TwitchModule } from '@modules/twitch/twitch.module';

@Module({
  imports: [AppConfigModule, DatabaseModule, TwitchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
