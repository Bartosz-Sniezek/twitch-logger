import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTwitchChannelsTable1767111040215 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "twitch_channels" (
        "twitch_user_id" TEXT NOT NULL,
        "login" TEXT NOT NULL,
        "display_name" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "profile_image_url" TEXT NOT NULL,
        "offline_image_url" TEXT NOT NULL,
        "channel_created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        CONSTRAINT "PK_twitch_channels" PRIMARY KEY ("twitch_user_id")
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_login" on "twitch_channels" ("login");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_display_name" on "twitch_channels" ("display_name");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_channel_created_at" on "twitch_channels" ("channel_created_at");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "twitch_channels";
    `);
  }
}
