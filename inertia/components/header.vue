<script setup lang="ts">
import { ref, computed } from 'vue'
import { router, Link, usePage } from '@inertiajs/vue3'

const menuOpen = ref(false)
const page = usePage()
const currentUrl = computed(() => page.url)
const appName = computed(() => page.props.appName)

const isActive = (href: string) => {
  if (href === '/') return currentUrl.value === '/'
  return currentUrl.value.startsWith(href)
}

const handleLogout = () => {
  menuOpen.value = false
  router.post('/logout')
}
</script>

<template>
  <header class="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 bg-white/70 shadow relative z-20">
    <div class="flex items-center gap-4">
      <Link
        href="/"><img :src="'/favicon/favicon.svg'"  alt="Logo" class="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-md border-4 border-blue-200 bg-white" /></Link>
      <h1 class="text-xl sm:text-3xl font-bold text-gray-600 tracking-tight whitespace-nowrap">{{ appName }} - {{ currentUrl.substring(1) === '' ? 'Home' : (currentUrl.substring(1).charAt(0).toUpperCase() + currentUrl.substring(1).slice(1)) }}</h1>
    </div>
    <!-- Desktop menu -->
    <nav class="hidden md:flex gap-2 items-center">
      <Link
        href="/admin"
        :class="[
          'px-4 py-2 rounded-lg shadow transition font-semibold',
          isActive('/admin') ? 'bg-blue-600 text-white' : 'bg-blue-400 hover:bg-blue-600 text-white'
        ]"
      >Admin</Link>
      <Link
        href="/profile"
        :class="[
          'px-4 py-2 rounded-lg shadow transition font-semibold',
          isActive('/profile') ? 'bg-blue-600 text-white' : 'bg-blue-400 hover:bg-blue-600 text-white'
        ]"
      >Profil</Link>
      <button
        @click="handleLogout"
        class="bg-red-800 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition font-semibold"
        type="button"
      >
        Se déconnecter
      </button>
    </nav>
    <!-- Burger button -->
    <button
      class="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded focus:outline-none"
      @click="menuOpen = !menuOpen"
      aria-label="Ouvrir le menu"
    >
      <span :class="['block h-1 w-6 bg-gray-600 rounded transition-all', menuOpen ? 'rotate-45 translate-y-2' : '']"></span>
      <span :class="['block h-1 w-6 bg-gray-600 rounded my-1 transition-all', menuOpen ? 'opacity-0' : '']"></span>
      <span :class="['block h-1 w-6 bg-gray-600 rounded transition-all', menuOpen ? '-rotate-45 -translate-y-2' : '']"></span>
    </button>
    <!-- Mobile menu -->
    <transition name="fade">
      <nav
        v-if="menuOpen"
        class="absolute top-full right-4 left-4 bg-white rounded-xl shadow-lg flex flex-col gap-2 py-4 px-6 mt-2 md:hidden z-30"
      >
        <Link
          href="/"
          @click="menuOpen = false"
          :class="[
            'px-4 py-2 rounded-lg shadow transition font-semibold text-center',
            isActive('/') ? 'bg-blue-600 text-white' : 'bg-blue-400 hover:bg-blue-600 text-white'
          ]"
        >Accueil</Link>
        <Link
          href="/profile"
          @click="menuOpen = false"
          :class="[
            'px-4 py-2 rounded-lg shadow transition font-semibold text-center',
            isActive('/profile') ? 'bg-blue-600 text-white' : 'bg-blue-400 hover:bg-blue-600 text-white'
          ]"
        >Profil</Link>
        <button
          @click="handleLogout"
          class="bg-red-800 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition font-semibold text-center"
          type="button"
        >
          Se déconnecter
        </button>
      </nav>
    </transition>
  </header>
</template>