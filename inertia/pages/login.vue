<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { useForm } from '@inertiajs/vue3'

const form = useForm({
  name: '',
  password: '',
})

const submit = () => {
  form.post('/login', {
    onFinish: () => form.reset(),
    onError: (errors) => {
      console.error(errors)
    },
  })
}
</script>


<template>
  <Head title="Login" />
  <div class="container mx-auto">
    <h1 class="text-3xl font-bold">Login</h1>
    <form @submit.prevent="submit">
      <div class="mt-4">
        <label for="name" class="block text mb-2">Name</label>
        <input
          type="text"
          id="name"
          v-model="form.name"
          class="border rounded px-3 py-2 w-full"
          required
        />
      </div>
      <div class="mt-4">
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <input
          type="password"
          id="password"
          v-model="form.password"
          class="border rounded px-3 py-2 w-full"
          required
        />
      </div>
      <div class="mt-4">
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
      </div>
    </form>
  </div>
</template>