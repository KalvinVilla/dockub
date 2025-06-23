import { UserRepository } from '#auth/repositories/user_repository'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

@inject()
export default class AdminController {
  constructor(private userRepository: UserRepository) {}

  static validator = vine.compile(
    vine.object({
      name: vine.string().minLength(3).maxLength(50),
      email: vine.string().email(),
      password: vine.string().minLength(6).maxLength(100),
      role: vine.enum(['admin', 'user']),
      hasEnableNotification: vine.boolean().optional(),
      subscription: vine
        .object({
          endpoint: vine.string().optional(),
          keys: vine.object({
            p256dh: vine.string().optional(),
            auth: vine.string().optional(),
          }),
        })
        .optional(),
    })
  )

  async execute({ request, response }: HttpContext) {
    const payload = await request.validateUsing(AdminController.validator)

    const { name, email, password, role, hasEnableNotification, subscription } = payload

    const user = await this.userRepository.create({
      name,
      email,
      password,
      role,
      notificationEnabled: hasEnableNotification ? 1 : 0,
      notificationEndpoint: subscription?.endpoint || null,
      notificationP256dh: subscription?.keys.p256dh || null,
      notificationAuth: subscription?.keys.auth || null,
    })

    if (!user) {
      return response.redirect().back()
    }

    return response.redirect().back()
  }
}
