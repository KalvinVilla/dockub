import router from '@adonisjs/core/services/router'
import transmit from '@adonisjs/transmit/services/main'

import { middleware } from '#start/kernel'

// TODO: use a database or cache for online users
export const onlineUsers = new Set<string>()

transmit.on('subscribe', ({ context, channel }) => {
  if (channel !== 'container') {
    return
  }
  if (context.auth?.user?.getMail()) {
    onlineUsers.add(context.auth.user.getMail())
  }
})

transmit.on('disconnect', ({ context }) => {
  if (context.auth?.user?.getMail()) {
    onlineUsers.delete(context.auth.user.getMail())
  }
})

router
  .group(() => {
    transmit.registerRoutes()
  })
  .middleware(middleware.auth())
