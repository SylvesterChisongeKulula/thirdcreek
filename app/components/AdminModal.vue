<script setup lang="ts">
import { X } from '@lucide/vue'

const props = defineProps<{
  modelValue: boolean
  title: string
}>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

function close() {
  emit('update:modelValue', false)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.modelValue) close()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-primary/50" @click="close" />
      <div class="crm-panel relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto">
        <div class="mb-4 flex items-center justify-between">
          <p class="font-display text-lg font-bold text-ink">{{ title }}</p>
          <button type="button" class="text-muted transition-colors hover:text-ink" aria-label="Close" @click="close">
            <X :size="20" />
          </button>
        </div>

        <slot />

        <div v-if="$slots.footer" class="mt-6 flex justify-end gap-3">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
