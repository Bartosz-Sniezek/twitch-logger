import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserChannelEntity } from './user-channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserChannelEntity])],
})
export class UserTwitchChannelsModule {}
