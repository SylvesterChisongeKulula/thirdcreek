<script setup lang="ts">
import { LayoutDashboard, Users, KanbanSquare, Package, Boxes, Receipt, Store } from '@lucide/vue'

defineProps<{ open: boolean }>()
defineEmits<{ close: [] }>()
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-surface-dark transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 px-5">
      <img src="/logo.png" alt="Third Creek Auto Spares" class="h-8 w-auto" />
      <span class="font-display font-bold text-on-dark text-sm tracking-wide">Admin</span>
    </div>

    <nav class="flex-1 overflow-y-auto py-5">
      <p class="label-uppercase text-on-dark-soft px-4 mb-1">Overview</p>
      <div class="flex flex-col gap-0.5 mb-6">
        <AdminSidebarLink to="/admin" :icon="LayoutDashboard" label="Dashboard" />
        <AdminSidebarLink to="/admin/contacts" :icon="Users" label="Contacts" />
        <AdminSidebarLink to="/admin/pipeline" :icon="KanbanSquare" label="Pipeline" />
        <AdminSidebarLink to="/admin/products" :icon="Package" label="Products" />
      </div>

      <p class="label-uppercase text-on-dark-soft px-4 mb-1">Coming Soon</p>
      <div class="flex flex-col gap-0.5">
        <AdminSidebarLink :icon="Boxes" label="Inventory" disabled />
        <AdminSidebarLink :icon="Receipt" label="Invoices" disabled />
        <AdminSidebarLink :icon="Store" label="Staff & Locations" disabled />
      </div>
    </nav>

    <div class="shrink-0 border-t border-white/10 p-4">
      <NuxtLink to="/" class="text-[13px] text-on-dark-soft hover:text-on-dark transition-colors">
        ← Back to website
      </NuxtLink>
    </div>
  </aside>

  <div v-if="open" class="fixed inset-0 z-30 bg-black/40 lg:hidden" @click="$emit('close')" />
</template>
