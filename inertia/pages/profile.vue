<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { useForm, usePage } from '@inertiajs/vue3'
import { ref } from 'vue'

import Header from '~/components/header.vue'

const page = usePage<{ user: { email: string, notificationEnabled: boolean, notificationEndpoint: string, notificationP256dh: string, notificationAuth: string }, publicKey: string }>().props
const user = ref(page.user)
const publicKey = ref(page.publicKey)
const { success } = usePage().props

const errorMessage = ref('')

const form = useForm({
  email: user.value.email,
  hasEnableNotification: user.value.notificationEnabled ?? false,
  subscription: {
    endpoint: user.value.notificationEndpoint ?? '',
    keys: {
      p256dh: user.value.notificationP256dh ?? '',
      auth: user.value.notificationAuth ?? '',
    },
  },
})

async function subscribeToPushNotifications() {
  const registration = await navigator.serviceWorker.register('sw.js')

  if (form.subscription.endpoint && form.subscription.keys.p256dh && form.subscription.keys.auth) {
    return
  }
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey.value),
    })

  form.subscription.endpoint = subscription.endpoint
  // @ts-ignore
  form.subscription.keys.p256dh = subscription.toJSON().keys.p256dh
  // @ts-ignore
  form.subscription.keys.auth = subscription.toJSON().keys.auth
  } catch (err) {
    console.error('Erreur abonnement push', err)
  }

}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

const submit = async () => {

  if (form.hasEnableNotification) {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
          errorMessage.value = 'Notifications non autorisées. Veuillez autoriser les notifications dans les paramètres de votre navigateur.'
          return
        }
        await subscribeToPushNotifications()
    } else {
      errorMessage.value = 'Push notifications are not supported in this browser.'
      return
    }
  } else {
    form.subscription.endpoint = ''
    form.subscription.keys.p256dh = ''
    form.subscription.keys.auth = ''
  }

  form.post('/profile', {
    preserveState: false,
    onFinish: () => form.reset(),
    onError: (errors) => {
      console.error(errors)
    },

  })

}

const advancedOptions = ref(false)
const toggleAdvancedOptions = () => {
  const value = advancedOptions.value
  advancedOptions.value = value
}


</script>

<template>
  <Head title="Profil" />
  <div class="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col">
    <Header />

    <main class="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <form @submit.prevent="submit" class="bg-white/90 shadow-xl rounded-2xl px-8 py-10 w-full max-w-md flex flex-col gap-5">
        <h2 class="text-2xl font-bold text-blue-700 mb-2 text-center">Paramètres du profil</h2>
        <div>
          <label for="email" class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input
            type="text"
            v-model="form.email"
            placeholder="email"
            class="pl-4 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none bg-blue-50"
          />
        </div>
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            id="hasEnableNotification"
            v-model="form.hasEnableNotification"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-400"
          />
          <label for="hasEnableNotification" class="text-sm font-semibold text-gray-700">Activer les notifications</label>
        </div>
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            id="advancedOptions"
            v-model="advancedOptions"
            @change="toggleAdvancedOptions"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-400"
          />
          <label for="advancedOptions" class="text-sm font-semibold text-gray-700">Options avancées</label>
        </div>
        <div v-if="advancedOptions" class="bg-blue-50 rounded-lg p-4 mt-2">
          <label class="block text-sm font-semibold text-gray-700 mb-1">Subscription Endpoint</label>
          <input
            type="text"
            v-model="form.subscription.endpoint"
            placeholder="Subscription Endpoint"
            class="pl-4 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none bg-white mb-2"
          />
          <label class="block text-sm font-semibold text-gray-700 mb-1">Keys P256DH</label>
          <input
            type="text"
            v-model="form.subscription.keys.p256dh"
            disabled
            placeholder="Keys P256DH"
            class="pl-4 pr-4 py-2 w-full rounded-lg border border-gray-300 bg-gray-100 mb-2"
          />
          <label class="block text-sm font-semibold text-gray-700 mb-1">Keys Auth</label>
          <input
            type="text"
            v-model="form.subscription.keys.auth"
            placeholder="Keys Auth"
            disabled
            class="pl-4 pr-4 py-2 w-full rounded-lg border border-gray-300 bg-gray-100"
          />
        </div>
        <div v-if="errorMessage" class="text-red-500 text-center mt-2">{{ errorMessage }}</div>
        <div v-if="success" class="mb-4 p-2 bg-green-100 text-green-800 rounded text-center">
          {{ success }}
        </div>
        <button type="submit" class="mt-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2 rounded-lg shadow-lg transition transform hover:-translate-y-0.5 hover:scale-105 active:scale-95">
          Mettre à jour
        </button>
      </form>
    </main>
  </div>
</template>