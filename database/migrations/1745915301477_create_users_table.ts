import type { Kysely } from 'kysely'

const tableName = 'users'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('password', 'text', (col) => col.notNull())
    .addColumn('notification_enabled', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('notification_endpoint', 'text')
    .addColumn('notification_p256dh', 'text')
    .addColumn('notification_auth', 'text')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(tableName).execute()
}
