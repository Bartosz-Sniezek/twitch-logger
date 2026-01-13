import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUsersChannelsTable1768058135342 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE users_channels');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users_channels" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" UUID NOT NULL,
        "twitch_user_id" TEXT NOT NULL REFERENCES twitch_channels ("twitch_user_id"),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        CONSTRAINT "PK_users_channels" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_users_channels_user_id" ON "users_channels" ("user_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_users_channels_twitch_user_id" ON "users_channels" ("twitch_user_id")
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_user_id_twitch_user_id" on "users_channels" ("user_id", "twitch_user_id")
    `);
  }
}
