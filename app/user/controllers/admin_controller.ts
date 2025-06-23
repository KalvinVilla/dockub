import { UserRepository } from '#auth/repositories/user_repository'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AdminController {
  constructor(private userRepository: UserRepository) {}

  async render({ inertia }: HttpContext) {
    const usersRepo = await this.userRepository.all('')

    // TODO move to view model
    const users = usersRepo.map((user) => {
      return {
        id: user.getId(),
        name: user.props.name,
        email: user.props.email,
      }
    })

    return inertia.render('admin', {
      users,
    })
  }
}
