import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import chalk from 'chalk';
import * as process from "node:process";

const migrationClient = postgres(process.env.DB_URL!, { max: 1 });

async function runMigrations() {
    try {
        await migrate(drizzle(migrationClient), { migrationsFolder: 'drizzle' });
        console.log(chalk.greenBright('Migrations applied successfully!'));
    } catch (error) {
        console.error(chalk.redBright('Error applying migrations:'), error);
    } finally {
        await migrationClient.end();
        process.exit();
    }
}

runMigrations();
