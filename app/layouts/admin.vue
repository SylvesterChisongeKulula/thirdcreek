<script setup lang="ts">
const route = useRoute()
const sidebarOpen = ref(false)

const title = computed(() => (route.meta.title as string | undefined) ?? 'Admin')

watch(
  () => route.fullPath,
  () => {
    sidebarOpen.value = false
  },
)
</script>

<template>
  <div class="flex min-h-screen bg-surface-soft">
    <AdminSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="flex min-w-0 flex-1 flex-col">
      <AdminTopbar :title="title" @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
    <AdminToast />
  </div>
</template>
