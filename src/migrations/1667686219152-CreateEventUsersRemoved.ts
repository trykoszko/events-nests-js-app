import {MigrationInterface, QueryRunner, Table} from "typeorm"
import {User} from "../modules/user/entities/user.entity";
import {Event} from "../modules/event/entities/event.entity";
import {faker} from "@faker-js/faker/locale/pl";

export class CreateEventUsersRemoved1667686219152 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "event_users_removed",
                columns: [
                    {
                        name: "user_id",
                        type: "int",
                    },
                    {
                        name: "event_id",
                        type: "int",
                    }
                ],
                foreignKeys: [
                    {
                        name: "event_users_removed",
                        columnNames: ["user_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "users",
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE",
                    },
                    {
                        name: "user_events_removed",
                        columnNames: ["event_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "events",
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE",
                    }
                ]
            }),
            true
        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("event_users_removed");
    }

}
