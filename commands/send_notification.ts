import { BaseCommand, args } from '@adonisjs/core/ace'
import { db } from '#core/services/db'
import env from '#start/env'
import webPush from 'web-push'

export default class Seed extends BaseCommand {
  static commandName = 'notification:send'
  static description = 'Send notification to users'

  @args.string({
    required: true,
    description: 'Type of notification to send',
  })
  declare title: string

  @args.string({
    required: true,
    description: 'Description of the notification',
  })
  declare body: string

  async run() {
    const userRecords = await db
      .selectFrom('users')
      .selectAll()
      .where('notification_enabled', '=', 1)
      .execute()

    webPush.setVapidDetails(
      'mailto:admin@example.com',
      env.get('VAPID_PUBLIC_KEY'),
      env.get('VAPID_PRIVATE_KEY')
    )

    const payload = JSON.stringify({
      title: this.title,
      body: this.body,
    })

    for (const userRecord of userRecords) {
      this.logger.info(
        `Sending notification to ${userRecord.email}... to endpoint ${userRecord.notification_endpoint}`
      )

      const subscription = {
        endpoint: userRecord.notification_endpoint,
        keys: {
          p256dh: userRecord.notification_p256dh,
          auth: userRecord.notification_auth,
        },
      }

      try {
        await webPush.sendNotification(subscription, payload)
        this.logger.info(`Notification sent to ${userRecord.email}`)
      } catch (error) {
        this.logger.error(`Failed to send notification to ${userRecord.email}:`, error)
      }
    }
    this.logger.info('Notification sending completed.')
  }
}
