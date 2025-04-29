<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { ref } from 'vue'
import { useForm } from '@inertiajs/vue3'

const form = useForm()

const submit = () => {
    form.post('/logout', {
        onError: (errors) => {
            console.error(errors)
        }
    })
}

</script>
<template>
  <Head title="Homepage" />

  <div class="container mx-auto">
    <h1 class="text-3xl font-bold">Welcome to the Homepage</h1>
    <p class="mt-4">This is the homepage of your application.</p>
    <form @submit.prevent="submit" class="mt-4">
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Logout</button>
    </form>
  </div>
</template>