import { listContainers } from '#start/docker'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class HomeController {
  constructor() {}

  async render({ inertia }: HttpContext) {
    const rawContainers = await listContainers()

    // TODO Move to a view model
    const containers = rawContainers.map((container: any) => ({
      id: container.Id,
      name: container.Names[0]?.replace('/', '') || 'unknown',
      image: container.Image,
      state: container.State,
      status: container.Status,
    }))
    return inertia.render('home', { container: containers })
  }
}
