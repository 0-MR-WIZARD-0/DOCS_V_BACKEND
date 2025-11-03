import { MigrationInterface, QueryRunner } from "typeorm";

export class InitAdmin1761991457486 implements MigrationInterface {
    name = 'InitAdmin1761991457486'

    public async up(queryRunner: QueryRunner): Promise<void> {
await queryRunner.query(`
            CREATE TABLE "admin" (
                "id" SERIAL NOT NULL,
                "username" character varying NOT NULL,
                "password" character varying NOT NULL,
                CONSTRAINT "UQ_username" UNIQUE ("username"),
                CONSTRAINT "PK_admin_id" PRIMARY KEY ("id")
            )
        `);

        const bcrypt = require('bcrypt');
        const hashed = await bcrypt.hash('admin123', 10);
        await queryRunner.query(
            `INSERT INTO "admin" (username, password) VALUES ('admin', '${hashed}')`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin" DROP COLUMN "role"`);
    }

}
