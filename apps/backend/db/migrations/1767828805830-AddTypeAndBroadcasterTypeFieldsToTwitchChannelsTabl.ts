import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTypeAndBroadcasterTypeFieldsToTwitchChannelsTabl1767828805830 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE twitch_channels
        ADD COLUMN user_type TEXT NOT NULL,
        ADD COLUMN broadcaster_type TEXT NOT NULL,
        ADD COLUMN revalidate_data_after TIMESTAMP WITH TIME ZONE NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE twitch_channels
        DROP COLUMN user_type,
        DROP COLUMN broadcaster_type,
        DROP COLUMN revalidate_data_after;
    `);
  }
}
