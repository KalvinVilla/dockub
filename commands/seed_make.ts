import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class MakeMigration extends BaseCommand {
  static commandName = 'seed:make'
  static description = 'Create a new seed file'
  static options: CommandOptions = {}

  @args.string({ description: 'Name of the seed file' })
  declare name: string

  async run() {
    const entity = this.app.generators.createEntity(this.name)
    const tableName = this.app.generators.tableName(entity.name)
    const fileName = `${tableName}.ts`

    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(this.app.commandsPath('stubs'), 'make/seeder.stub', {
      entity,
      migration: {
        tableName,
        fileName,
      },
    })
  }
}
