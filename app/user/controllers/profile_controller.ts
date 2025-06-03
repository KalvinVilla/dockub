import { UserRepository } from '#auth/repositories/user_repository'
import env from '#start/env'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

@inject()
export default class ProfileController {
  constructor(private userRepository: UserRepository) {}

  static validator = vine.compile(
    vine.object({
      email: vine.string().email(),
      hasEnableNotification: vine.boolean(),
      subscription: vine.object({
        endpoint: vine.string().optional(),
        keys: vine.object({
          p256dh: vine.string().optional(),
          auth: vine.string().optional(),
        }),
      }),
    })
  )

  async render({ inertia, auth }: HttpContext) {
    if (!auth.user) {
      return inertia.render('login')
    }

    const user = await this.userRepository.where('id').find(auth.user.getIdentifier().toString())

    if (!user) {
      return inertia.render('login')
    }

    return inertia.render('profile', {
      user: {
        email: user.props.email,
        notificationEnabled: Boolean(user.props.notificationEnabled),
        notificationEndpoint: user.props.notificationEndpoint,
        notificationP256dh: user.props.notificationP256dh,
        notificationAuth: user.props.notificationAuth,
      },
      publicKey: env.get('VAPID_PUBLIC_KEY'),
    })
  }
  async execute({ request, response, auth }: HttpContext) {
    const { email, hasEnableNotification, subscription } = await request.validateUsing(
      ProfileController.validator
    )

    if (!auth.user) {
      return response.redirect().back()
    }

    if (hasEnableNotification) {
      if (subscription.endpoint && subscription.keys) {
        if (subscription.keys.p256dh && subscription.keys.auth) {
          this.userRepository.updateProfile({
            id: auth.user?.getIdentifier().toString(),
            email: email,
            // @ts-ignore (this is a number between 0 and 1)
            notificationEnabled: +hasEnableNotification,
            notificationEndpoint: subscription.endpoint,
            notificationP256dh: subscription.keys.p256dh,
            notificationAuth: subscription.keys.auth,
          })
          return response.redirect().back()
        }
      }
    }

    this.userRepository.updateProfile({
      id: auth.user?.getIdentifier().toString(),
      email: email,
      // @ts-ignore (this is a number between 0 and 1)
      notificationEnabled: 0,
      notificationEndpoint: '',
      notificationP256dh: '',
      notificationAuth: '',
    })

    return response.redirect().back()
  }
}
