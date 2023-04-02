import {DataSource, DataSourceOptions} from 'typeorm';
import {ConfigService} from '@nestjs/config';
import {config} from 'dotenv';

config();

const configService = new ConfigService();

export const dbConfig: DataSourceOptions = {
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    entities: [
        __dirname + '/**/*.entity.js',
    ],
    migrations: [
        __dirname + '/**/migrations/*.js',
    ],
    migrationsTableName: 'migrations',
    synchronize: false,
    migrationsRun: false,
    extra:
        configService.get('POSTGRES_USE_SSL')
            ? {
                ssl: {
                    rejectUnauthorized: false,
                },
            }
            : {},
    ssl: configService.get('POSTGRES_USE_SSL') ?? false,
    // logging: true
};

const dataSource: DataSource = new DataSource(dbConfig);

export default dataSource;
