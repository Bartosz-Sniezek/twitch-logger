export const KAFKA_TOPICS = {
  TWITCH_CHANNELS_EVENTS_TOPIC: 'twitch.channels.events',
  TWITCH_CHANNELS_DLQ_TOPIC: 'twitch.channels.events.dlq',
  TWITCH_LOGGER_OUTBOX_TOPIC: 'twitch.logger.outbox',
} as const;
