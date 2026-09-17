<script setup lang="ts">
import { CircleCheckBig } from '@lucide/vue'

const form = reactive({
  name: '',
  phone: '',
  email: '',
  message: '',
})

const errors = reactive({
  name: '',
  phone: '',
  message: '',
})

const submitted = ref(false)

function validate() {
  errors.name = form.name.trim() ? '' : 'Please enter your name.'
  errors.phone = form.phone.trim() ? '' : 'Please enter a phone number.'
  errors.message = form.message.trim() ? '' : 'Let us know what part or service you need.'
  return !errors.name && !errors.phone && !errors.message
}

function handleSubmit() {
  if (!validate()) return
  submitted.value = true
}

function resetForm() {
  form.name = ''
  form.phone = ''
  form.email = ''
  form.message = ''
  submitted.value = false
}
</script>

<template>
  <div class="bg-canvas border border-hairline p-6 sm:p-8">
    <div v-if="submitted" class="text-center py-8">
      <CircleCheckBig :size="48" class="mx-auto mb-4 text-success" />
      <h3 class="font-display font-bold text-xl text-ink mb-2">Enquiry received</h3>
      <p class="font-body font-light text-body mb-6">
        Thank you, {{ form.name }}. Our team will get back to you shortly.
      </p>
      <button type="button" class="btn-secondary" @click="resetForm">Send another enquiry</button>
    </div>

    <form v-else class="space-y-5" novalidate @submit.prevent="handleSubmit">
      <div>
        <label for="name" class="label-uppercase text-ink block mb-2">Name</label>
        <input id="name" v-model="form.name" type="text" class="text-input" placeholder="Your full name" />
        <p v-if="errors.name" class="text-[13px] text-error mt-1">{{ errors.name }}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label for="phone" class="label-uppercase text-ink block mb-2">Phone</label>
          <input id="phone" v-model="form.phone" type="tel" class="text-input" placeholder="e.g. 0770 598 983" />
          <p v-if="errors.phone" class="text-[13px] text-error mt-1">{{ errors.phone }}</p>
        </div>
        <div>
          <label for="email" class="label-uppercase text-ink block mb-2">Email (optional)</label>
          <input id="email" v-model="form.email" type="email" class="text-input" placeholder="you@example.com" />
        </div>
      </div>

      <div>
        <label for="message" class="label-uppercase text-ink block mb-2">What do you need?</label>
        <textarea
          id="message"
          v-model="form.message"
          rows="4"
          class="text-input resize-none"
          placeholder="Tell us the part or service you're looking for"
        />
        <p v-if="errors.message" class="text-[13px] text-error mt-1">{{ errors.message }}</p>
      </div>

      <button type="submit" class="btn-primary w-full sm:w-auto">Send Enquiry</button>
    </form>
  </div>
</template>
