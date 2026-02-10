import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Client } from 'tmi.js';
import { TwitchKafkaProducer } from './twitch-kafka.producer';
import {
  MessageActor,
  TwitchChannelEvent,
} from '../../models/twitch-channel-event';

@Injectable()
export class TmiLogger implements OnModuleInit, OnModuleDestroy {
  private readonly tmi = new Client({
    channels: [],
  });
  private ready = false;

  constructor(private readonly twitchKafkaProducer: TwitchKafkaProducer) {}

  async onModuleDestroy(): Promise<void> {
    this.ready = false;
    await this.tmi.disconnect();
  }

  async onModuleInit(): Promise<void> {
    this.tmi.on('join', (channel, username, _self) => {
      if (_self) return;

      void this.twitchKafkaProducer.sendMessage(
        this.createSystemTwitchMessage({
          type: 'join',
          channel,
          username,
        }),
      );
    });

    this.tmi.on('part', (channel, username, _self) => {
      if (_self) return;

      void this.twitchKafkaProducer.sendMessage(
        this.createSystemTwitchMessage({
          type: 'part',
          channel,
          username,
        }),
      );
    });

    this.tmi.on(
      'subscription',
      (channel, username, methods, message, userstate) => {
        void this.twitchKafkaProducer.sendMessage(
          this.createUserTwitchMessage({
            type: 'subscription',
            channel,
            message,
            username: username,
            userstate,
            metadata: { methods },
          }),
        );
      },
    );

    this.tmi.on(
      'anonsubgift',
      (channel, streakMonths, recipient, methods, userstate) => {
        void this.twitchKafkaProducer.sendMessage(
          this.createUserTwitchMessage({
            type: 'anonsubgift',
            channel,
            metadata: {
              methods,
              recipient,
              streakMonths,
              anonSubGiftUserstate: userstate,
            },
          }),
        );
      },
    );

    this.tmi.on(
      'subgift',
      (channel, username, streakMonths, recipient, methods, userstate) => {
        void this.twitchKafkaProducer.sendMessage(
          this.createUserTwitchMessage({
            type: 'subgift',
            channel,
            username,
            userstate,
            metadata: { methods, recipient, streakMonths },
          }),
        );
      },
    );

    this.tmi.on('emoteonly', (channel, enabled) => {
      void this.twitchKafkaProducer.sendMessage(
        this.createSystemTwitchMessage({
          channel,
          type: 'emoteonly',
          metadata: {
            enabled,
          },
        }),
      );
    });

    this.tmi.on(
      'resub',
      (channel, username, months, message, userstate, methods) => {
        void this.twitchKafkaProducer.sendMessage(
          this.createUserTwitchMessage({
            type: 'resub',
            channel,
            message,
            username,
            userstate,
            metadata: {
              months,
              methods,
            },
          }),
        );
      },
    );

    this.tmi.on('ban', (channel, username, reason, userstate) => {
      void this.twitchKafkaProducer.sendMessage(
        this.createUserTwitchMessage({
          type: 'ban',
          channel,
          username,
          userstate,
          metadata: {
            reason,
          },
        }),
      );
    });

    this.tmi.on('timeout', (channel, username, reason, duration, userstate) => {
      void this.twitchKafkaProducer.sendMessage(
        this.createUserTwitchMessage({
          type: 'timeout',
          channel,
          username,
          userstate,
          metadata: {
            duration,
            reason,
          },
        }),
      );
    });

    this.tmi.on('message', (channel, userstate, message) => {
      void this.twitchKafkaProducer.sendMessage(
        this.createUserTwitchMessage({
          type: 'message',
          channel,
          message,
          username: userstate.username,
          userstate,
        }),
      );
    });

    this.tmi.on(
      'messagedeleted',
      (channel, username, deletedMessage, userstate) => {
        void this.twitchKafkaProducer.sendMessage(
          this.createUserTwitchMessage({
            type: 'messagedeleted',
            channel,
            username,
            message: deletedMessage,
            userstate,
          }),
        );
      },
    );

    await this.tmi.connect();
    this.ready = true;
  }

  async joinChannel(channel: string): Promise<void> {
    await this.waitForConnection();
    if (this.tmi.getChannels().includes(channel)) return;

    await this.tmi.join(channel);
  }

  async leaveChannel(channel: string): Promise<void> {
    await this.waitForConnection();
    if (!this.tmi.getChannels().includes(channel)) return;

    await this.tmi.part(channel);
  }

  private async waitForConnection(): Promise<void> {
    for (let attempt = 0; attempt < 10; ++attempt) {
      if (this.ready) return;
      else await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    throw new Error('Failed to connect to tmi');
  }

  private createSystemTwitchMessage({
    channel,
    type,
    username,
    metadata,
  }: SystemTwitchMessageOptions): TwitchChannelEvent {
    return TwitchChannelEvent.create({
      actor: MessageActor.SYSTEM,
      type,
      channel,
      username: username ?? null,
      timestamp: Date.now(),
      message: null,
      metadata,
      userId: null,
    });
  }

  private createUserTwitchMessage(
    options: UserTwitchMessageOptions,
  ): TwitchChannelEvent {
    return TwitchChannelEvent.create({
      type: options.type,
      actor: MessageActor.USER,
      channel: options.channel,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      userId: options.userstate?.['user-id'] ?? null,
      username: options.username ?? null,
      message: options.message ?? null,
      timestamp: options.userstate?.['tmi-sent-ts']
        ? +options.userstate['tmi-sent-ts']
        : Date.now(),
      metadata: { userstate: options.userstate, ...options.metadata },
    });
  }
}

interface UserTwitchMessageOptions {
  type: string;
  channel: string;
  username?: string;
  message?: string;
  userstate?: unknown;
  metadata?: { [key: string]: unknown };
}

interface SystemTwitchMessageOptions {
  type: string;
  channel: string;
  username?: string;
  metadata?: { [key: string]: unknown };
}
