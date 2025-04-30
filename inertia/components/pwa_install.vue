<script setup lang="ts">
import { onMounted, ref } from 'vue'

const showPrompt = ref(false)
let deferredPrompt: Event | null = null

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    showPrompt.value = true
  })
})

const installApp = async () => {
  if (!deferredPrompt) return
  ;(deferredPrompt as any).prompt()
  const { outcome } = await (deferredPrompt as any).userChoice
  if (outcome === 'accepted') {
    showPrompt.value = false
    deferredPrompt = null
  }
}
</script>

<template>
  <div v-if="showPrompt" class="fixed bottom-4 inset-x-0 flex justify-center z-50">
    <div
      class="bg-white shadow-xl rounded-lg px-6 py-4 flex items-center space-x-4 border border-gray-300 animate-fade-in"
    >
      <div class="text-gray-800 font-medium">
        <span>Installer cette application ?</span>
      </div>
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        @click="installApp"
      >
        Installer
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
