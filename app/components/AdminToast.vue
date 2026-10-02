<script setup lang="ts">
import { X } from '@lucide/vue'

const { toasts, dismiss } = useToast()
</script>

<template>
  <div class="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2" aria-live="polite">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="pointer-events-auto flex items-start gap-3 border bg-canvas px-4 py-3 text-[14px] shadow-lg"
      :class="toast.tone === 'error' ? 'border-error/40 text-error' : 'border-success/40 text-ink'"
      role="status"
    >
      <p class="flex-1">{{ toast.message }}</p>
      <button type="button" class="shrink-0 text-muted hover:text-ink" aria-label="Dismiss" @click="dismiss(toast.id)">
        <X :size="16" />
      </button>
    </div>
  </div>
</template>
