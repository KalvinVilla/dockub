export interface ContainerInfo {
  id: string
  name: string
  image: string
  state: 'running' | 'exited' | string
}
