import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTwitchEventsTable1770498468724 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "twitch_channels_events" (
            "id" UUID NOT NULL DEFAULT uuidv7(),
            "actor" TEXT NOT NULL,
            "channel" TEXT NOT NULL,
            "type" TEXT NOT NULL,
            "user_id" TEXT,
            "username" TEXT,
            "message" TEXT,
            "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL,
            "metadata" JSONB,
            CONSTRAINT "PK_twitch_channels_events" PRIMARY KEY ("id")
        );
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_twitch_channels_events_id" ON "twitch_channels_events" ("id");`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_twitch_channels_events_channel" ON "twitch_channels_events" ("channel");`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_twitch_channels_events_timestamp" ON "twitch_channels_events" ("timestamp");`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "twitch_channels_events";');
  }
}
