import { createRequire } from 'node:module'
import transmit from '@adonisjs/transmit/services/main'
const require = createRequire(import.meta.url)

const Docker = require('dockerode')

const docker = new Docker({ socketPath: '/var/run/docker.sock' })

export async function listContainers() {
  try {
    const containers = await docker.listContainers({ all: true })
    return containers
  } catch (error) {
    console.error('Erreur lors de la récupération des conteneurs :', error)
    return []
  }
}

export async function startContainer(id: string) {
  try {
    const container = docker.getContainer(id)

    await container.start()

    const info = await container.inspect()
    const newState = info.State.Status

    transmit.broadcast('container', {
      id,
      state: newState,
    })

    return true
  } catch (error) {
    console.error('Erreur lors du démarrage du conteneur :', error)
    return false
  }
}

export async function stopContainer(id: string) {
  try {
    const container = docker.getContainer(id)
    await container.stop()

    const info = await container.inspect()
    const newState = info.State.Status

    transmit.broadcast('container', {
      id,
      state: newState,
    })

    return true
  } catch (error) {
    console.error("Erreur lors de l'arrêt du conteneur :", error)
    return false
  }
}
