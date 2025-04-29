import { BaseCommand, args } from '@adonisjs/core/ace'
import { db } from '#core/services/db'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { DB } from '#types/db'

export default class Seed extends BaseCommand {
  static commandName = 'seed:purge'
  static description = 'Seed database'

  tables: { tablename: string }[] = []

  @args.string({
    required: true,
    description: 'Table name or "all" to purge all tables',
  })
  declare tableName: string

  static options: CommandOptions = {
    startApp: true,
  }

  /**
   * The complete lifecycle hook runs after the "run" method
   * and hence, we use it to close the data connection.
   */
  async completed() {
    await db.destroy()
  }

  private async purgeTable(tableName: keyof DB) {
    try {
      console.log(`Purging table: ${tableName}...`)
      await db.deleteFrom(tableName).execute()
      console.log(`✅ Table "${tableName}" purged successfully.`)
    } catch (error) {
      console.error(`❌ Error purging table "${tableName}":`, error)
    }
  }

  private async purgeAllTables() {
    try {
      console.log('Purging all tables...')

      for (const { tablename } of this.tables) {
        await this.purgeTable(tablename as keyof DB)
      }

      console.log('✅ All tables purged successfully.')
    } catch (error) {
      console.error('❌ Error purging all tables:', error)
    }
  }

  async run() {
    this.tables = await db
      .selectFrom('pg_tables')
      .select(['tablename'])
      .where('schemaname', '=', 'public')
      .execute()

    if (this.tableName === 'all') {
      await this.purgeAllTables()
    } else {
      const validTables = this.tables.map((row) => row.tablename)

      if (!validTables.includes(this.tableName as keyof DB)) {
        console.error(`❌ Table "${this.tableName}" does not exist in the database schema.`)
        return
      }

      await this.purgeTable(this.tableName as keyof DB)
    }
  }
}
