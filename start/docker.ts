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
    const info = await container.inspect()
    const newState = info.State.Status

    return { id, state: newState }
  } catch (error) {
    return { id, state: 'error' }
  }
}

export async function stopContainer(id: string) {
  try {
    const container = docker.getContainer(id)
    await container.stop()
    const info = await container.inspect()
    const newState = info.State.Status

    return { id, state: newState }
  } catch (error) {
    return { id, state: 'error' }
  }
}
