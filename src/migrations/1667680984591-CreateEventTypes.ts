import {MigrationInterface, QueryRunner, Table} from "typeorm"
import {EventType} from "../modules/event/entities/event-type.entity";

export class CreateEventTypes1667680984591 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'event_types',
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
                        name: 'slug',
                        type: 'varchar',
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                    },
                    {
                        name: 'icon',
                        type: 'varchar',
                    },
                    {
                        name: 'color',
                        type: 'varchar',
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('event_types');
    }

}
