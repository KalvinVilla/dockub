import webPush from 'web-push'

import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class Migrate extends BaseCommand {
  static commandName = 'generate:web-push'
  static description = 'Generate web push notification keys'
  static options: CommandOptions = {
    startApp: false,
  }

  /**
   * Runs migrations up method
   */
  async run() {
    const vapidKeys = webPush.generateVAPIDKeys()
    this.logger.info('Please set these keys in your environment variables:')
    this.logger.info('VAPID Public Key: ' + vapidKeys.publicKey)
    this.logger.info('VAPID Private Key: ' + vapidKeys.privateKey)
  }
}
