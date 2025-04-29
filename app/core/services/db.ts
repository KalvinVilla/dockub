import SQLite from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'
import app from '@adonisjs/core/services/app'
import type { DB } from '#types/db'

const dialect = new SqliteDialect({
  database: new SQLite(app.makePath('tmp/db.sqlite')),
})

export const db = new Kysely<DB>({
  dialect,
})
