import {MigrationInterface, QueryRunner, Table} from "typeorm"
import {faker} from "@faker-js/faker/locale/pl";
import slugify from "../helpers";
import {User} from "../modules/user/entities/user.entity";

export class CreateUsers1667656401921 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
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
                        name: 'email',
                        type: 'varchar',
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'first_name',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'last_name',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'gender',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'birthdate',
                        type: 'timestamp without time zone',
                        isNullable: true,
                    },
                    {
                        name: 'location_city',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'location_country',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'bio',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'avatar_url',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'social_url_instagram',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'social_url_facebook',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'facebook_user_id',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'permissions',
                        type: 'int',
                        default: 1,
                    },
                    {
                        name: 'terms_accepted',
                        type: 'boolean',
                        default: false,
                        isNullable: true,
                    },
                    {
                        name: 'is_active',
                        type: 'boolean',
                        default: false,
                        isNullable: true,
                    },
                    {
                        name: 'confirmation_token',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'password_reset_token',
                        type: 'varchar',
                        isNullable: true,
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
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }

}
