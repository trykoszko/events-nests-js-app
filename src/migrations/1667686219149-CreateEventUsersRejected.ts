import {MigrationInterface, QueryRunner, Table} from "typeorm"

export class CreateEventUsersRejected1667686219149 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "event_users_rejected",
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
                        name: "event_users_rejected",
                        columnNames: ["user_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "users",
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE",
                    },
                    {
                        name: "user_events_rejected",
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
        await queryRunner.dropTable("event_users_rejected");
    }

}
