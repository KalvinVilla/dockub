import { createRequire } from 'node:module'
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
    return true
  } catch (error) {
    console.error("Erreur lors de l'arrêt du conteneur :", error)
    return false
  }
}
