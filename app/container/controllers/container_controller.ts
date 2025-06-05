import { startContainer, stopContainer } from '#start/docker'
import NotificationService from '#user/services/notification_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ContainerController {
  constructor(private notificationService: NotificationService) {}

  async start({ response, params }: HttpContext) {
    const id = params.id

    const containerState = await startContainer(id)
    this.notificationService.broadcast(
      {
        title: 'Container Started',
        body: `The container with ID ${id} has been started.`,
      },
      containerState
    )
    return response.redirect().back()
  }

  async stop({ response, params }: HttpContext) {
    const id = params.id

    const containerState = await stopContainer(id)
    this.notificationService.broadcast(
      {
        title: 'Container stopped',
        body: `The container with ID ${id} has been stopped.`,
      },
      containerState
    )

    return response.redirect().back()
  }
}
