import { MigrationInterface, QueryRunner } from "typeorm";

export class Table1720090819059 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS User (
            id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL ,
        password VARCHAR(255) NOT NULL ,
        phoneNumber INT NOT NULL, 
        is_active TINYINT NOT NULL DEFAULT '1',
        created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        updated_by INT NULL,
        UNIQUE KEY IDX_85effe573294353b4188964e9d(email),
        UNIQUE KEY IDX_85effe573294353b418896i8h(password),
        PRIMARY KEY(id))
      ENGINE = InnoDB
      DEFAULT CHARACTER SET = utf8mb3;`);

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS Follow (
        id INT NOT NULL AUTO_INCREMENT,
        follower_id INT NOT NULL,
        followee_id INT NOT NULL,
        created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        updated_by INT NULL,
        CONSTRAINT FK_a0031c9280d3f1f7127368543fb FOREIGN KEY(follower_id) REFERENCES User(id),
        CONSTRAINT FK_a0031c9280d3f1f7127368522ke FOREIGN KEY(followee_id) REFERENCES User(id),
        PRIMARY KEY(id))
      ENGINE = InnoDB
      DEFAULT CHARACTER SET = utf8mb3;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
    }

}
