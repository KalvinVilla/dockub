import { AuthService } from '#auth/services/auth_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

@inject()
export default class LoginController {
  constructor(private authService: AuthService) {}

  static validator = vine.compile(
    vine.object({
      name: vine.string(),
      password: vine.string(),
    })
  )

  render({ inertia }: HttpContext) {
    return inertia.render('login')
  }

  async execute({ auth, request, response, session }: HttpContext) {
    const { name, password } = await request.validateUsing(LoginController.validator)
    const user = await this.authService.attempt(name, password)

    if (!user) {
      session.flashErrors({
        E_INVALID_CREDENTIALS: "Aucun compte n'a été trouvé avec les identifiants fournis.",
      })

      return response.redirect().back()
    }

    await auth.use('web').login(user)

    return response.redirect().toPath('/')
  }
}
