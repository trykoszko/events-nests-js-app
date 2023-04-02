import { DataSource } from "typeorm";

export async function prepareDb(connection: DataSource): Promise<void>
{
    console.log('Preparing database...');

    await connection.dropDatabase();

    await connection.runMigrations();

    console.log('Database ready for testing.');
}
