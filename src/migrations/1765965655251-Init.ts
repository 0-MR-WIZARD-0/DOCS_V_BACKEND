import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1765965655251 implements MigrationInterface {
    name = 'Init1765965655251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admin" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'admin', CONSTRAINT "UQ_5e568e001f9d1b91f67815c580f" UNIQUE ("username"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subsection" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "sectionId" integer NOT NULL, "order" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_aebbb84e28d5deec5bc853b9f0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "section" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "order" integer NOT NULL DEFAULT '1', CONSTRAINT "UQ_87d27f969ad248d1c293c068ef2" UNIQUE ("name"), CONSTRAINT "PK_3c41d2d699384cc5e8eac54777d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "document" ("id" SERIAL NOT NULL, "title" character varying, "description" character varying, "sectionId" integer NOT NULL, "subsectionId" integer, "filename" character varying, "path" character varying, "createdAt" date NOT NULL, "order" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_e57d3357f83f3cdc0acffc3d777" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "subsection" ADD CONSTRAINT "FK_a5185d9a88484c25bbe57b89556" FOREIGN KEY ("sectionId") REFERENCES "section"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document" ADD CONSTRAINT "FK_281a7bda99cc2532918f0e30bbd" FOREIGN KEY ("sectionId") REFERENCES "section"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document" ADD CONSTRAINT "FK_b1e8c5c3cec3f4a08f42c6bcdca" FOREIGN KEY ("subsectionId") REFERENCES "subsection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document" DROP CONSTRAINT "FK_b1e8c5c3cec3f4a08f42c6bcdca"`);
        await queryRunner.query(`ALTER TABLE "document" DROP CONSTRAINT "FK_281a7bda99cc2532918f0e30bbd"`);
        await queryRunner.query(`ALTER TABLE "subsection" DROP CONSTRAINT "FK_a5185d9a88484c25bbe57b89556"`);
        await queryRunner.query(`DROP TABLE "document"`);
        await queryRunner.query(`DROP TABLE "section"`);
        await queryRunner.query(`DROP TABLE "subsection"`);
        await queryRunner.query(`DROP TABLE "admin"`);
    }

}
