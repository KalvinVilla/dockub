import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

const Docker = require('dockerode')

const docker = new Docker({ socketPath: '/var/run/docker.sock' })

export async function groupContainersWorkingDir() {
  try {
    const containers = await docker.listContainers({ all: true })
    const groupedContainers: any = {}

    for (const container of containers) {
      const workingDir =
        container.Labels?.['com.docker.compose.project.working_dir'] || container.Names[0]
      const name = workingDir.split('/').pop()

      if (!name) {
        console.warn('No name found for container:', container)
        continue
      }
      if (!groupedContainers[name]) {
        groupedContainers[name] = []
      }

      groupedContainers[name].push(container)
    }
    return groupedContainers
  } catch (error) {
    console.error('Error', error)
    return {}
  }
}

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
