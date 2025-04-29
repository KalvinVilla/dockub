/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const LoginController = () => import('#auth/controllers/login_controller')
const LogoutController = () => import('#auth/controllers/logout_controller')

router
  .group(() => {
    router.get('login', [LoginController, 'render']).as('auth.login')
    router.post('login', [LoginController, 'execute']).as('auth.login.post')
  })
  .middleware(middleware.guest())

router
  .group(() => {
    router.post('logout', [LogoutController, 'execute']).as('auth.logout')
    router.on('/').renderInertia('home')
  })
  .middleware(middleware.auth())
