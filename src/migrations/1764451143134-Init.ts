import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1764451143134 implements MigrationInterface {
    name = 'Init1764451143134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admin" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'admin', CONSTRAINT "UQ_5e568e001f9d1b91f67815c580f" UNIQUE ("username"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`);
        const bcrypt = require('bcrypt');
        const hashed = await bcrypt.hash('admin123', 10);
        await queryRunner.query(
            `INSERT INTO "admin" (username, password) VALUES ('admin', '${hashed}')`
        );
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "document" ("id" SERIAL NOT NULL, "title" character varying, "description" character varying, "filename" character varying, "path" character varying, "createdAt" date NOT NULL, "categoryId" integer, CONSTRAINT "PK_e57d3357f83f3cdc0acffc3d777" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "document" ADD CONSTRAINT "FK_5b18ea09bcb701252fc224bcbf2" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document" DROP CONSTRAINT "FK_5b18ea09bcb701252fc224bcbf2"`);
        await queryRunner.query(`DROP TABLE "document"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "admin"`);
    }

}
