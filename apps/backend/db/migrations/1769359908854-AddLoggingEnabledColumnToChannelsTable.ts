import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLoggingEnabledColumnToChannelsTable1769359908854 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE twitch_channels
            ADD COLUMN logging_enabled boolean NOT NULL DEFAULT false;
    `);
    await queryRunner.query(`
        CREATE TABLE twitch_channels_outbox (
            "event_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
            "event_name" TEXT NOT NULL,
            "channel_name" TEXT NOT NULL,
            "completed" BOOLEAN NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            CONSTRAINT "PK_twitch_channels_outbox" PRIMARY KEY ("event_id")
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE twitch_channels
            DROP COLUMN logging_enabled;
    `);

    await queryRunner.query(`
            DROP TABLE twitch_channels_outbox;
    `);
  }
}
