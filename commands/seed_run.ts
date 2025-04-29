import { BaseCommand, args } from '@adonisjs/core/ace'
import { db } from '#core/services/db'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import fs from 'node:fs/promises'
import path from 'node:path'

export default class Seed extends BaseCommand {
  static commandName = 'seed:run'
  static description = 'Seed database'

  @args.string({
    required: true,
  })
  declare type: 'main' | 'fake'

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

  async getSeedersFiles(dir: string): Promise<string[]> {
    let filesList: string[] = []
    const files = await fs.readdir(dir, { withFileTypes: true })

    for (const file of files) {
      const fullPath = path.join(dir, file.name)
      if (file.isDirectory()) {
        const nestedFiles = await this.getSeedersFiles(fullPath)
        filesList = filesList.concat(nestedFiles)
      } else if (file.name.endsWith('.ts') || file.name.endsWith('.js')) {
        filesList.push(fullPath)
      }
    }

    return filesList
  }

  async run() {
    console.log(`Seeding database with type: ${this.type}...`)

    const seedersPath = path.join(this.app.seedersPath(), this.type)
    const files = await this.getSeedersFiles(seedersPath)

    for (const file of files) {
      const seeder = await import(file)
      if (typeof seeder.default === 'function') {
        console.log(`Executing: ${file}`)
        await seeder.default(db)
      }
    }

    console.log('Seeding completed.')
  }
}
