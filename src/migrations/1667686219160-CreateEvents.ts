import {MigrationInterface, QueryRunner, Table} from "typeorm"
import {User} from "../modules/user/entities/user.entity";
import {EventType} from "../modules/event/entities/event-type.entity";
import {faker} from "@faker-js/faker/locale/pl";
import {Event} from "../modules/event/entities/event.entity";

export class CreateEvents1667680984591 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'events',
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
                        name: 'title',
                        type: 'varchar',
                    },
                    {
                        name: 'slug',
                        type: 'varchar',
                    },
                    {
                        name: 'location_city',
                        type: 'varchar',
                    },
                    {
                        name: 'location_country',
                        type: 'varchar',
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                    },
                    {
                        name: 'slots',
                        type: 'int',
                    },
                    {
                        name: 'date_time',
                        type: 'timestamp without time zone',
                        default: 'now()',
                    },
                    {
                        name: 'duration',
                        type: 'int',
                    },
                    {
                        name: 'background_image_url',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'is_open',
                        type: 'boolean',
                        default: false,
                        isNullable: true,
                    },
                    {
                        name: 'is_address_visible',
                        type: 'boolean',
                        default: false,
                        isNullable: true,
                    },
                    {
                        name: 'is_userlist_visible',
                        type: 'boolean',
                        default: false,
                        isNullable: true,
                    },
                    {
                        name: 'is_allowed_to_join_when_in_progress',
                        type: 'boolean',
                        default: false,
                        isNullable: true,
                    },
                    {
                        name: 'type_id',
                        type: 'int',
                        unsigned: true,
                    },
                    {
                        name: 'owner_id',
                        type: 'int',
                        unsigned: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp without time zone',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp without time zone',
                        default: 'now()',
                        onUpdate: 'now()',
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ['type_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'event_types',
                        onDelete: 'CASCADE',
                    },
                    {
                        columnNames: ['owner_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'users',
                        onDelete: 'CASCADE',
                    }
                ]
            }),
            true
        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('events');
    }

}
