<script setup lang="ts">
interface ContainerInfo {
  id: string
  name: string
  image: string
  state: string
  status: string
}
interface Group {
  appName: string
  containers: ContainerInfo[]
}

import { ref, inject, onMounted, onUnmounted} from 'vue'
import { Head, usePage, router, Link } from '@inertiajs/vue3'
import type { Transmit } from '@adonisjs/transmit-client'

const transmit = inject<Transmit>('transmit')
let subscription: ReturnType<Transmit['subscription']> | null = null

onMounted(() => {
  if (!transmit) return
  subscription = transmit.subscription('container')
  subscription.create().then(() => {
    subscription?.onMessage((data: { id: string; state: string }) => {
      for (const group of groups.value) {
        const target = group.containers.find((c) => c.id === data.id)
        if (target) {
          target.state = data.state
        }
      }
    })
  })
})

onUnmounted(() => {
  subscription?.delete()
  subscription = null
})

const page = usePage<{ groups: Group[] }>().props
const groups = ref(page.groups)

const startContainer = async (id: string) => {
  router.post(`/container/${id}/start`)
}

const stopContainer = async (id: string) => {
  router.post(`/container/${id}/stop`)
}

const restartGroup = (group: Group) => {
  group.containers.forEach((container) => {
    if (container.state !== 'running') {
      startContainer(container.id)
    }
  })
}

</script>

<template>
  <Head title="Docker Manager" />

  <div class="container mx-auto p-4">
    <Link href="/profile" class="bg-blue-500 text-white px-4 py-2 rounded">Profile</Link>
    <button @click="router.post('/logout')" class="btn btn-primary mb-4 float-right" type="button">
      Se déconnecter
    </button>
    <h1 class="text-3xl font-bold text-center my-6">Mes applications Docker Compose</h1>

    <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(group, gidx) in groups"
        :key="gidx"
        class="card shadow-xl bg-base-100 border"
      >
        <div class="card-body">
          <div class="flex items-center justify-between">
            <h2 class="card-title">{{ group.appName }}</h2>
            <!-- Bouton restart si au moins un container n'est pas running -->
            <button
              v-if="group.containers.some(c => c.state !== 'running')"
              @click="restartGroup(group)"
              class="btn btn-warning btn-xs"
              title="Redémarrer tous les containers arrêtés"
            >
              <span class="material-icons text-base align-middle">restart_alt</span>
              Restart
            </button>
          </div>
          <div class="flex flex-wrap gap-2 mt-2">
            <span
              v-for="container in group.containers"
              :key="container.id"
              class="px-2 py-1 rounded text-xs"
              :class="container.state === 'running' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'"
            >
              {{ container.name }}
            </span>
          </div>
          <div class="mt-4 space-y-2">
            <div
              v-for="container in group.containers"
              :key="container.id"
              class="border rounded p-2 flex items-center justify-between"
            >
              <div>
                <div class="font-semibold">{{ container.name }}</div>
                <div class="text-xs text-gray-500">{{ container.image }}</div>
                <div>
                  <strong>État:</strong>
                  <span :class="container.state === 'running' ? 'text-green-600' : 'text-red-600'">
                    {{ container.state }}
                  </span>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  v-if="container.state !== 'running'"
                  @click="startContainer(container.id)"
                  class="btn btn-success btn-xs"
                >
                  Démarrer
                </button>
                <button
                  v-else
                  @click="stopContainer(container.id)"
                  class="btn btn-error btn-xs"
                >
                  Arrêter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>