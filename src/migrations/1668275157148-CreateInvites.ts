import {MigrationInterface, QueryRunner, Table} from "typeorm"
import {User} from "../modules/user/entities/user.entity";
import {Event} from "../modules/event/entities/event.entity";
import {faker} from "@faker-js/faker/locale/pl";
import {Invite} from "../modules/invite/entities/invite.entity";

export class CreateInvites1668275157148 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'invites',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        unsigned: true,
                        isUnique: true,
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'uuid',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: "owner_id",
                        type: "int",
                    },
                    {
                        name: "event_id",
                        type: "int",
                    },
                    {
                        name: "message",
                        type: "varchar",
                    }
                ],
                foreignKeys: [
                    {
                        name: "event_id",
                        columnNames: ["event_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "events",
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE",
                    },
                    {
                        name: "owner_id",
                        columnNames: ["owner_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "users",
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE",
                    }
                ]
            }),
            true
        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('invites');
    }

}
