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
const HomeController = () => import('#user/controllers/home_controller')
const ProfileController = () => import('#user/controllers/profile_controller')

const ContainerController = () => import('#container/controllers/container_controller')

router
  .group(() => {
    router.get('login', [LoginController, 'render']).as('auth.login')
    router.post('login', [LoginController, 'execute']).as('auth.login.post')
  })
  .middleware(middleware.guest())

router
  .group(() => {
    router.post('logout', [LogoutController, 'execute']).as('auth.logout')
    router.get('/', [HomeController, 'render']).as('home')

    router.get('profile', [ProfileController, 'render']).as('profile')
    router.post('profile', [ProfileController, 'execute']).as('profile.post')

    router.post('container/:id/start', [ContainerController, 'start']).as('container.start')
    router.post('container/:id/stop', [ContainerController, 'stop']).as('container.stop')
  })
  .middleware(middleware.auth())
