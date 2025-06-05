import { groupContainersWorkingDir } from '#start/docker'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class HomeController {
  constructor() {}

  async render({ inertia }: HttpContext) {
    const grouped = await groupContainersWorkingDir()

    // TODO : Move to view model
    const groups = (Object.entries(grouped) as [string, any[]][]).map(([appName, containers]) => ({
      appName,
      containers: containers.map((container) => ({
        id: container.Id,
        name: container.Names[0]?.replace('/', '') || 'unknown',
        image: container.Image,
        state: container.State,
        status: container.Status,
      })),
    }))

    return inertia.render('home', { groups })
  }
}
