import { inject } from '@adonisjs/core'
import env from '#start/env'
import webPush from 'web-push'
import transmit from '@adonisjs/transmit/services/main'
import { UserRepository } from '#auth/repositories/user_repository'
import { Logger } from '@adonisjs/core/logger'
import { onlineUsers } from '#start/transmit'

@inject()
export default class NotificationService {
  constructor(
    private readonly userRepository: UserRepository,
    private logger: Logger
  ) {}

  async broadcast(
    payload: { title: string; body: string },
    containerState: { id: string; state: string }
  ) {
    transmit.broadcast('container', {
      id: containerState.id,
      state: containerState.state,
      message: payload,
    })

    const userRecords = await this.userRepository.where('notification_enabled').all(1)

    userRecords.forEach(async (userRecord) => {
      const { notificationEndpoint, notificationP256dh, notificationAuth, email } = userRecord.props

      const isOnline = this.isUserOnline(email)
      if (isOnline) {
        return
      } else {
        if (!notificationEndpoint || !notificationP256dh || !notificationAuth) {
          this.logger.warn(`Skipping user ${email} due to missing subscription details`)
          return
        }

        webPush.setVapidDetails(
          env.get('WEB_PUSH_SUBJECT'),
          env.get('VAPID_PUBLIC_KEY'),
          env.get('VAPID_PRIVATE_KEY')
        )

        const subscription = {
          endpoint: notificationEndpoint as string,
          keys: {
            p256dh: notificationP256dh as string,
            auth: notificationAuth as string,
          },
        }

        try {
          await webPush.sendNotification(subscription, JSON.stringify(payload))
          this.logger.debug(`Notification sent to ${email}`)
        } catch (error) {
          this.logger.error(`Failed to send notification to ${email}:`, JSON.stringify(error))
        }
      }
    })
  }

  isUserOnline(email: string): boolean {
    // TODO: use a database or cache for online users
    return onlineUsers.has(email)
  }
}
