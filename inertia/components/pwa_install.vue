<!-- resources/js/Components/PwaInstallPrompt.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Shared states
const isIos = ref(false)
const isInStandaloneMode = ref(false)
const showPrompt = ref(false)
const isManualPrompt = ref(false)

const deferredPrompt = ref<Event | null>(null)

const detectiOS = () => {
  const userAgent = window.navigator.userAgent.toLowerCase()
  console.log('User Agent:', userAgent)
  return /iphone|ipad|ipod/.test(userAgent)
}

const detectStandalone = () => {
  return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone
}

const installPWA = async () => {
  if (deferredPrompt.value && 'prompt' in deferredPrompt.value) {
    const promptEvent = deferredPrompt.value as any
    promptEvent.prompt()
    const { outcome } = await promptEvent.userChoice
    if (outcome === 'accepted') {
      console.log('PWA installed')
    }
    showPrompt.value = false
    deferredPrompt.value = null
  }
}

const closePrompt = () => {
  showPrompt.value = false
}

onMounted(() => {
  isIos.value = detectiOS()
  isInStandaloneMode.value = detectStandalone()

  // iOS: show prompt manually
  if (isIos.value && !isInStandaloneMode.value) {
    showPrompt.value = true
    isManualPrompt.value = true
  }

  // Android: use native prompt
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault()
    deferredPrompt.value = e
    showPrompt.value = true
    isManualPrompt.value = false
  })

  // Hide if already installed
  window.addEventListener('appinstalled', () => {
    showPrompt.value = false
    deferredPrompt.value = null
  })

})
</script>

<template>
  <div
    v-if="showPrompt"
    class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <template v-if="isManualPrompt">
        <h2 class="text-xl font-bold mb-2">Install this app</h2>
        <p class="text-gray-700 mb-4">
          Tap <span class="font-bold">Share</span> then <span class="font-bold">“Add to Home Screen”</span> to install this app on your iPhone or iPad.
        </p>
      </template>

      <template v-else>
        <h2 class="text-xl font-bold mb-2">Install this app?</h2>
        <p class="text-gray-700 mb-4">Add this app to your home screen for a better experience.</p>
        <div class="flex justify-end space-x-2">
          <button @click="closePrompt" class="px-4 py-2 border rounded text-gray-700">Not now</button>
          <button @click="installPWA" class="px-4 py-2 bg-blue-600 text-white rounded">Install</button>
        </div>
      </template>
    </div>
  </div>
</template>
