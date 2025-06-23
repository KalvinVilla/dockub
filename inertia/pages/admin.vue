<script setup lang="ts">
import { ref, computed } from 'vue'
import { Head, useForm, usePage } from '@inertiajs/vue3'
import Header from '~/components/header.vue'

const props = usePage<{ users: any}>().props

const allUsers = ref(props.users)
console.log(props.users)

const search = ref('')
const page = ref(1)
const perPage = 10

const filteredUsers = computed(() => {
  if (!search.value) return allUsers.value
  return allUsers.value.filter(u =>
    u.email.toLowerCase().includes(search.value.toLowerCase()) ||
    u.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

const paginatedUsers = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredUsers.value.slice(start, start + perPage)
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / perPage))

function goToPage(p: number) {
  if (p >= 1 && p <= totalPages.value) page.value = p
}

function toggleActive(user: any) {
  user.active = !user.active
}

function removeUser(user: any) {
  allUsers.value = allUsers.value.filter(u => u.id !== user.id)
}

// Modal logic
const showModal = ref(false)
const form = useForm({
  email: '',
  name: '',
  password: '',
  role: 'user',
})

// const newUser = ref({
//   email: '',
//   username: '',
//   role: 'user',
// })

function openModal() {
  showModal.value = true
}
function closeModal() {
  showModal.value = false
}
function submitNewUser() {
  if (!form.email || !form.name) return
  // const id = allUsers.value.length + 1
  // allUsers.value.push({
  //   id,
  //   email: form.email,
  //   name: form.username,
  //   role: form.role,
  //   active: true,
  // })
  form.post('/admin/user', {
    onSuccess: () => {
      form.reset()
    },
    onError: (errors) => {
      console.error(errors)
    }
  })
  closeModal()
}
</script>

<template>
  <Head title="Admin" />
  <div class="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col relative">
    <Header />

    <!-- Modal -->
    <transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm bg-black/30"
      >
        <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
          <button @click="closeModal" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold">&times;</button>
          <h3 class="text-xl font-bold text-blue-700 mb-4">Ajouter un utilisateur</h3>
          <form @submit.prevent="submitNewUser" class="flex flex-col gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="pl-4 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none bg-blue-50"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Nom d'utilisateur</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="pl-4 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none bg-blue-50"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
              <input
                v-model="form.password"
                type="password"
                required
                class="pl-4 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none bg-blue-50"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Rôle</label>
              <select
                v-model="form.role"
                class="pl-4 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none bg-blue-50"
              >
                <option value="user">Utilisateur</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              class="bg-green-200 hover:bg-green-300 text-green-900 px-4 py-2 rounded-lg shadow font-semibold transition"
            >
              Ajouter
            </button>
          </form>
        </div>
      </div>
    </transition>

    <main :class="showModal ? 'pointer-events-none blur-sm select-none' : ''" class="flex-1 w-full px-6 py-8 transition-all duration-200">
      <div class="max-w-5xl mx-auto grid gap-8">
        <!-- Card module utilisateur -->
        <div class="bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col gap-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 class="text-2xl font-bold text-blue-700">Gestion des utilisateurs</h2>
            <div class="flex gap-2">
              <input
                v-model="search"
                type="text"
                placeholder="Search..."
                class="pl-4 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition outline-none bg-blue-50"
              />
              <button
                @click="openModal"
                class="bg-green-200 hover:bg-green-300 text-green-900 px-4 py-2 rounded-lg shadow font-semibold transition"
              >
                Ajouter
              </button>
            </div>
          </div>
          <div class="overflow-x-auto rounded-xl shadow bg-white">
            <table class="min-w-full divide-y divide-blue-100">
              <thead>
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase">Email</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase">Nom d'utilisateur</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase">Rôle</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase">Statut</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-blue-50 transition">
                  <td class="px-4 py-3 font-medium text-gray-800">{{ user.email }}</td>
                  <td class="px-4 py-3">{{ user.name }}</td>
                  <td class="px-4 py-3">{{ user.role }}</td>
                  <td class="px-4 py-3">
                    <span
                      :class="user.active ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'"
                      class="px-2 py-1 rounded-full text-xs font-semibold"
                    >
                      {{ user.active ? 'Actif' : 'Inactif' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 flex gap-2">
                    <button
                      @click="toggleActive(user)"
                      :class="user.active
                        ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900'
                        : 'bg-green-200 hover:bg-green-300 text-green-900'"
                      class="px-3 py-1 rounded-lg shadow text-xs font-semibold transition"
                    >
                      {{ user.active ? 'Désactiver' : 'Activer' }}
                    </button>
                    <button
                      @click="removeUser(user)"
                      class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow text-xs font-semibold transition"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
                <tr v-if="paginatedUsers.length === 0">
                  <td colspan="5" class="px-4 py-6 text-center text-gray-400">Aucun utilisateur trouvé.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Pagination -->
          <div class="flex justify-center items-center gap-2" v-if="totalPages > 1">
            <button
              @click="goToPage(page - 1)"
              :disabled="page === 1"
              class="px-3 py-1 rounded-lg bg-blue-200 hover:bg-blue-300 text-blue-900 font-semibold shadow transition disabled:opacity-50"
            >
              Précédent
            </button>
            <span class="font-semibold text-blue-700">Page {{ page }} / {{ totalPages }}</span>
            <button
              @click="goToPage(page + 1)"
              :disabled="page === totalPages"
              class="px-3 py-1 rounded-lg bg-blue-200 hover:bg-blue-300 text-blue-900 font-semibold shadow transition disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
        <!-- Ici tu pourras ajouter d'autres cards/modules admin plus tard -->
      </div>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>