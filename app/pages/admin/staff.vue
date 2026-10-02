<script setup lang="ts">
import { Plus } from '@lucide/vue'
import type { StaffAccount, StaffAccountInput } from '~/data/crm-staff'

definePageMeta({ layout: 'admin', title: 'Staff' })

const { user } = useAuth()
const { staffState, addStaff, updateStaff, setStaffPassword, removeStaffLogin } = useStaff()
const toast = useToast()

const isOwner = computed(() => user.value?.authRole === 'owner')

type ModalRef = { setError: (message: string) => void } | null

const showForm = ref(false)
const editing = ref<StaffAccount | null>(null)
const formRef = ref<ModalRef>(null)

function openAdd() {
  editing.value = null
  showForm.value = true
}

function openEdit(member: StaffAccount) {
  editing.value = member
  showForm.value = true
}

async function onSubmit(input: StaffAccountInput & { name: string; password: string }) {
  try {
    if (editing.value) await updateStaff(editing.value.id, input)
    else await addStaff(input)
    showForm.value = false
    toast.show(editing.value ? 'Staff member updated.' : `${input.name} can now log in.`, 'success')
  } catch (error) {
    formRef.value?.setError(apiErrorMessage(error))
  }
}

const showPassword = ref(false)
const passwordFor = ref<StaffAccount | null>(null)
const passwordRef = ref<ModalRef>(null)

function openPassword(member: StaffAccount) {
  passwordFor.value = member
  showPassword.value = true
}

async function onPassword({ next }: { next: string }) {
  if (!passwordFor.value) return
  try {
    await setStaffPassword(passwordFor.value.id, next)
    showPassword.value = false
    toast.show(`Password set for ${passwordFor.value.name}.`, 'success')
  } catch (error) {
    passwordRef.value?.setError(apiErrorMessage(error))
  }
}

async function onRemoveLogin(member: StaffAccount) {
  if (!confirm(`Remove ${member.name}'s login? They'll be signed out and can't log in until you set a new password.`)) return
  try {
    await removeStaffLogin(member.id)
    toast.show(`${member.name} can no longer log in.`, 'success')
  } catch (error) {
    toast.show(apiErrorMessage(error))
  }
}
</script>

<template>
  <div v-if="!isOwner" class="crm-panel text-center">
    <p class="text-[14px] text-muted">Only the owner can manage staff accounts.</p>
  </div>

  <div v-else class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <p class="label-uppercase text-muted">{{ staffState.length }} staff members</p>
      <button type="button" class="btn-primary inline-flex items-center gap-2" @click="openAdd">
        <Plus :size="16" /> Add Staff Member
      </button>
    </div>

    <div class="crm-panel overflow-x-auto">
      <table class="w-full min-w-[760px] text-left text-[14px]">
        <thead>
          <tr class="border-b border-hairline text-[12px] text-muted">
            <th class="pb-3 font-normal">Name</th>
            <th class="pb-3 font-normal">Role</th>
            <th class="pb-3 font-normal">Branch</th>
            <th class="pb-3 font-normal">Access</th>
            <th class="pb-3 font-normal">Login</th>
            <th class="pb-3 font-normal">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in staffState" :key="member.id" class="border-b border-hairline last:border-b-0">
            <td class="py-3 font-semibold text-ink">
              {{ member.name }}
              <span v-if="member.id === user?.staffId" class="ml-1 text-[12px] font-normal text-muted">(you)</span>
            </td>
            <td class="py-3 text-body">{{ member.role }}</td>
            <td class="py-3 text-body">{{ member.location }}</td>
            <td class="py-3">
              <span
                class="px-1.5 py-0.5 text-[11px] font-semibold"
                :class="member.authRole === 'owner' ? 'bg-primary/10 text-primary' : 'bg-surface-strong text-ink'"
              >
                {{ member.authRole === 'owner' ? 'Owner' : 'Staff' }}
              </span>
            </td>
            <td class="py-3">
              <span v-if="member.hasLogin" class="text-[13px] text-ink">Can log in</span>
              <span v-else class="text-[13px] text-muted">No login</span>
            </td>
            <td class="py-3">
              <div class="flex flex-wrap gap-3">
                <button type="button" class="text-link-cta" @click="openEdit(member)">Edit</button>
                <button type="button" class="text-link-cta" @click="openPassword(member)">
                  {{ member.hasLogin ? 'Reset password' : 'Give login' }}
                </button>
                <button
                  v-if="member.hasLogin"
                  type="button"
                  class="text-[13px] font-bold uppercase tracking-[1.5px] text-error"
                  @click="onRemoveLogin(member)"
                >
                  Remove login
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <StaffFormModal ref="formRef" v-model="showForm" :member="editing" @submit="onSubmit" />
    <PasswordModal
      ref="passwordRef"
      v-model="showPassword"
      :title="passwordFor ? `Set password for ${passwordFor.name}` : 'Set password'"
      @submit="onPassword"
    />
  </div>
</template>
