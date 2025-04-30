<script setup lang="ts">

interface ContainerInfo {
  id: string
  name: string
  image: string
  state: 'running' | 'exited' | string
}

import { onMounted, onUnmounted, ref } from 'vue'
import { Head, usePage, router } from '@inertiajs/vue3'
import PwaInstall from '~/components/pwa_install.vue'

import { Transmit } from '@adonisjs/transmit-client'
import { v7 as randomUUID } from 'uuid'

const transmit = ref<Transmit | null>(null)
let subscription: ReturnType<Transmit['subscription']> | null = null

onMounted(() => {
  const instance = new Transmit({
    baseUrl: window.location.origin,
    uidGenerator: randomUUID,
  })
  transmit.value = instance

  subscription = instance.subscription('container')
  subscription.create().then(() => {
    subscription?.onMessage((data: { id: string; state: string }) => {
      const target = containers.value.find(c => c.id === data.id)
      if (target) {
        target.state = data.state
      }
    })
  })
})

onUnmounted(() => {
  if (subscription) {
    subscription.delete()
    subscription = null
  }
})

const page = usePage<{ container: ContainerInfo[] }>().props
const containers = ref(page.container)

const startContainer = async (id: string) => {
  router.post(`/container/${id}/start`)
}

const stopContainer = async (id: string) => {
  await router.post(`/container/${id}/stop`)
}
</script>

<template>
  <Head title="Docker Manager" />

  <div class="container mx-auto p-4">
    <PwaInstall />
    <button
      @click="router.post('/logout')"
      class="btn btn-primary mb-4 float-right"
      type="button"
    >
      Se deconnecter
    </button>
    <h1 class="text-3xl font-bold text-center my-6">Mes conteneurs Docker</h1>

    <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(item, index) in containers"
        :key="index"
        class="card shadow-xl bg-base-100 border"
      >
        <div class="card-body">
          <h2 class="card-title">{{ item.name }}</h2>
          <p><strong>Image:</strong> {{ item.image }}</p>
          <p>
            <strong>État:</strong>
            <span :class="item.state === 'running' ? 'text-green-600' : 'text-red-600'">
              {{ item.state }}
            </span>
          </p>
          <div class="card-actions mt-4">
            <button
              v-if="item.state !== 'running'"
              @click="startContainer(item.id)"
              class="btn btn-success btn-sm"
            >
              Démarrer
            </button>
            <button
              v-else
              @click="stopContainer(item.id)"
              class="btn btn-error btn-sm"
            >
              Arrêter
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
