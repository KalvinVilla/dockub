<script setup lang="ts">
import { computed } from 'vue'
import { Head } from '@inertiajs/vue3'
import { useForm, usePage } from '@inertiajs/vue3'
import { usePageErrors } from '~/composables/use_page_errors';

import PwaInstallPrompt from '~/components/pwa_install.vue'

const props = usePage<{appName: string}>().props
const appName = computed(() => props.appName)

const form = useForm({
  name: '',
  password: '',
})

const errors = usePageErrors();

const submit = () => {
  form.post('/login', {
    onFinish: () => form.reset(),
  })
}



</script>

<template>
  <Head title="Login" />
  <div class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-blue-200">
    <div class="bg-white shadow-xl rounded-2xl px-10 py-10 w-full max-w-sm flex flex-col items-center">
      <!-- Logo -->
      <img :src="'/favicon/favicon.svg'" alt="Logo" class="w-20 h-20 mb-6 rounded-full shadow-md border-4 border-blue-200 bg-white" />

      <h1 class="text-3xl font-bold text-blue-700 mb-8 tracking-tight">{{ appName }}</h1>
      <form @submit.prevent="submit" class="w-full flex flex-col gap-5">
        <div>
          <label for="name" class="block text-sm font-semibold text-gray-700 mb-1">Nom d'utilisateur</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" />
                <circle cx="12" cy="11" r="3" />
              </svg>
            </span>
            <input
              type="text"
              id="name"
              v-model="form.name"
              class="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none bg-blue-50"
              required
              autocomplete="username"
            />
          </div>
        </div>
        <div>
          <label for="password" class="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <rect width="16" height="10" x="4" y="7" rx="5" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
            <input
              type="password"
              id="password"
              v-model="form.password"
              class="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none bg-blue-50"
              required
              autocomplete="current-password"
            />
          </div>
        </div>
        <button
          type="submit"
          class="mt-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2 rounded-lg shadow-lg transition transform hover:-translate-y-0.5 hover:scale-105 active:scale-95"
        >
          Connexion
        </button>
        <div v-if="errors.E_INVALID_CREDENTIALS" class="text-red-500 text-center mt-2">
          {{ errors.E_INVALID_CREDENTIALS }}
        </div>
      </form>
    </div>
    <PwaInstallPrompt />
  </div>
</template>