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
import { Head, usePage, router } from '@inertiajs/vue3'
import type { Transmit } from '@adonisjs/transmit-client'

import Header from '~/components/header.vue'

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
  <div class="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col">
    <!-- Header -->
    <Header />

    <!-- Main grid -->
    <main class="flex-1 w-full px-6 py-8">
      <div class="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
        <div
          v-for="(group, gidx) in groups"
          :key="gidx"
          class="bg-white/80 border border-blue-100 rounded-xl shadow p-6 flex flex-col"
        >
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-xl font-bold text-blue-800">{{ group.appName }}</h2>
            <button
              v-if="group.containers.some(c => c.state !== 'running')"
              @click="restartGroup(group)"
              class="bg-blue-200 hover:bg-blue-300 text-blue-900 font-semibold px-3 py-1 rounded-lg shadow transition flex items-center gap-1 text-sm"
              title="Redémarrer tous les containers arrêtés"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.5 19A9 9 0 1119 5.5" />
              </svg>
              Restart
            </button>
          </div>
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="container in group.containers"
              :key="container.id"
              class="px-2 py-1 rounded-full text-xs font-semibold"
              :class="container.state === 'running' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'"
            >
              {{ container.name }}
            </span>
          </div>
          <div class="space-y-3">
            <div
              v-for="container in group.containers"
              :key="container.id"
              class="bg-white border border-blue-100 rounded-lg p-3 flex items-center justify-between shadow-sm"
            >
              <div>
                <div class="font-semibold text-blue-900">{{ container.name }}</div>
                <div class="text-xs text-gray-500 mb-1">{{ container.image }}</div>
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
                  class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg shadow text-xs font-semibold transition"
                >
                  Démarrer
                </button>
                <button
                  v-else
                  @click="stopContainer(container.id)"
                  class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow text-xs font-semibold transition"
                >
                  Arrêter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>