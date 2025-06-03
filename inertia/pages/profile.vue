<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { useForm, usePage } from '@inertiajs/vue3'
import { ref } from 'vue'

const page = usePage<{ user: { email: string, notificationEnabled: boolean, notificationEndpoint: string, notificationP256dh: string, notificationAuth: string }, publicKey: string }>().props
const user = ref(page.user)
const publicKey = ref(page.publicKey)
const logs = ref<string[]>([])
function log(msg: string) {
  logs.value.push(msg)
}

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
  log('Abonnement push en cours...')
  const registration = await navigator.serviceWorker.register('sw.js')

  if (form.subscription.endpoint && form.subscription.keys.p256dh && form.subscription.keys.auth) {
    log('L abonnement push existe déjà:' + form.subscription.endpoint)
    return
  }
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey.value),
    })

  log('Abonnement push réussi:' + JSON.stringify(subscription))

  form.subscription.endpoint = subscription.endpoint
  // @ts-ignore
  form.subscription.keys.p256dh = subscription.toJSON().keys.p256dh
  // @ts-ignore
  form.subscription.keys.auth = subscription.toJSON().keys.auth
  console.log('Abonnement push enregistré avec succès.')
    console.log('Abonnement réussi', subscription)
  } catch (err) {
    console.error('Erreur abonnement push', err)
    log(`Erreur abonnement push` + JSON.stringify(err))
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
    // if ('serviceWorker' in navigator && 'PushManager' in window) {
      const permission = await Notification.requestPermission()
        console.log('Permission pour les notifications:', permission)
      if (permission === 'granted') {
        log('Permission pour les notifications.')
        await subscribeToPushNotifications()
      }
    // } else {
    //   log('Push API non supportée par ce navigateur.')
    // }
  } else {
    log('Notifications désactivées')
    form.subscription.endpoint = ''
    form.subscription.keys.p256dh = ''
    form.subscription.keys.auth = ''
  }

  form.post('/profile', {
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
  <Head title="Docker Manager" />

  <div class="container mx-auto p-4">
  <Link href="/" class="bg-blue-500 text-white px-4 py-2 rounded">Home</Link><br /><br />
  <button onclick="Notification.requestPermission().then(p => alert(p))">
  Activer les notifications
</button>
  <div v-for="message in logs">{{ message }}</div>
  <form @submit.prevent="submit" class="mt-4">
    <label for="email" class="block text mb-2">Email</label>
    <input
      type="text"
      v-model="form.email"
      placeholder="email"
      class="border rounded px-3 py-2 w-full mb-4"
    />
    <label for="hasEnableNotification" class="block text mb-2">Enable Notifications</label>
    <input
      type="checkbox"
      v-model="form.hasEnableNotification"
      class="mb-4"
    />
    <label for="subscription" class="block text mb-2">Advanced options</label>
    <input
      type="checkbox"
      v-model="advancedOptions"
      @change="toggleAdvancedOptions"
      class="mb-4"

    /><br />
    <div v-if="advancedOptions">
      <label for="subscription" class="block text mb-2">Subscription</label>
      <input
        type="text"
        v-model="form.subscription.endpoint"
        placeholder="Subscription Endpoint"
        class="border rounded px-3 py-2 w-full mb-4"
      />
      <label for="keys" class="block text mb-2">1Keys</label>
      <input
        type="text"
        v-model="form.subscription.keys.p256dh"
        disabled
        placeholder="Keys P256DH"
        class="border rounded px-3 py-2 w-full mb-4"
      />
      <input
        type="text"
        v-model="form.subscription.keys.auth"
        placeholder="Keys Auth"
        disabled
        class="border rounded px-3 py-2 w-full mb-4"
      />
    </div>
    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
  </form>
  </div>
</template>