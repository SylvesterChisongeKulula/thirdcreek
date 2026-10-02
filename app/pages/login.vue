<script setup lang="ts">
definePageMeta({ layout: false })

const name = ref('')
const password = ref('')
const error = ref('')
const submitting = ref(false)

const { login } = useAuth()

async function submit() {
  error.value = ''
  if (!name.value.trim() || !password.value) {
    error.value = 'Name and password are required.'
    return
  }

  submitting.value = true
  try {
    await login(name.value.trim(), password.value)
    await navigateTo('/admin')
  } catch (err) {
    error.value = apiErrorMessage(err, 'Name or password is incorrect.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-surface-soft px-4">
    <div class="crm-panel w-full max-w-sm">
      <div class="mb-6 flex flex-col items-center gap-2">
        <img src="/logo.png" alt="Third Creek Auto Spares" class="h-10 w-auto" />
        <p class="font-display text-lg font-bold text-ink">Admin Login</p>
      </div>

      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <p v-if="error" class="text-[13px] text-error">{{ error }}</p>

        <input v-model="name" type="text" placeholder="Your name" class="text-input" autocomplete="username" />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="text-input"
          autocomplete="current-password"
        />

        <button type="submit" class="btn-primary w-full" :disabled="submitting">
          {{ submitting ? 'Signing in…' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>
