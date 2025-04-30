import { startContainer, stopContainer } from '#start/docker'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ContainerController {
  constructor() {}

  async start({ response, params }: HttpContext) {
    const id = params.id
    await startContainer(id)
    return response.redirect().back()
  }

  async stop({ response, params }: HttpContext) {
    const id = params.id

    await stopContainer(id)

    return response.redirect().back()
  }
}
