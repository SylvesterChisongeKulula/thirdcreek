import type { Ref } from 'vue'
import type {
  DayTheme,
  EngagementLog,
  MarketingPartner,
  MarketingTask,
  PlaybookItem,
  PlaybookSection,
  RoutineTaskDef,
  TaskCategory,
} from '~/data/marketing'
import type { StaffAccount, StaffAccountInput } from '~/data/crm-staff'

export type PartnerFormInput = Omit<MarketingPartner, 'id' | 'createdAt' | 'updatedAt'>
export type EngagementInput = Pick<
  EngagementLog,
  'weekStart' | 'postsPublished' | 'comments' | 'messages' | 'newFollowers' | 'reach' | 'notes'
>

export function useMarketingPartners() {
  const partnersFetch = useFetch<MarketingPartner[]>('/api/admin/marketing/partners', {
    default: () => [],
  })
  const partnersState = computed(() => partnersFetch.data.value ?? [])

  async function addPartner(input: PartnerFormInput) {
    const partner = await $fetch<MarketingPartner>('/api/admin/marketing/partners', { method: 'POST', body: input })
    await partnersFetch.refresh()
    return partner
  }

  async function updatePartner(id: string, input: Partial<PartnerFormInput>) {
    const partner = await $fetch<MarketingPartner>(`/api/admin/marketing/partners/${id}`, {
      method: 'PATCH',
      body: input,
    })
    await partnersFetch.refresh()
    return partner
  }

  async function deletePartner(id: string) {
    await $fetch(`/api/admin/marketing/partners/${id}`, { method: 'DELETE' })
    await partnersFetch.refresh()
  }

  return { partnersState, addPartner, updatePartner, deletePartner }
}

export function useEngagementLogs() {
  const logsFetch = useFetch<EngagementLog[]>('/api/admin/marketing/engagement', {
    default: () => [],
  })
  const logsState = computed(() => logsFetch.data.value ?? [])

  async function saveLog(input: EngagementInput) {
    const log = await $fetch<EngagementLog>('/api/admin/marketing/engagement', { method: 'POST', body: input })
    await logsFetch.refresh()
    return log
  }

  return { logsState, saveLog }
}

export function useMarketingTasks(range: Ref<{ from: string; to: string }>) {
  const tasksFetch = useFetch<MarketingTask[]>('/api/admin/marketing/tasks', {
    query: range,
    default: () => [],
  })
  const tasksState = computed(() => tasksFetch.data.value ?? [])

  async function setTaskDone(id: number, done: boolean) {
    await $fetch(`/api/admin/marketing/tasks/${id}`, { method: 'PATCH', body: { done } })
    await tasksFetch.refresh()
  }

  async function addTask(input: { date: string; title: string; category: TaskCategory; assignedTo?: string | null }) {
    const task = await $fetch<MarketingTask>('/api/admin/marketing/tasks', { method: 'POST', body: input })
    await tasksFetch.refresh()
    return task
  }

  async function deleteTask(id: number) {
    await $fetch(`/api/admin/marketing/tasks/${id}`, { method: 'DELETE' })
    await tasksFetch.refresh()
  }

  return { tasksState, setTaskDone, addTask, deleteTask, pending: tasksFetch.pending }
}

export type RoutineInput = Pick<RoutineTaskDef, 'weekday' | 'title' | 'category' | 'link'>
export type PlaybookInput = Pick<PlaybookItem, 'section' | 'title' | 'body' | 'details'>

export function useMarketingRoutine() {
  const routineFetch = useFetch<{ themes: DayTheme[]; tasks: RoutineTaskDef[] }>('/api/admin/marketing/routine', {
    default: () => ({ themes: [], tasks: [] }),
  })
  const themesState = computed(() => routineFetch.data.value?.themes ?? [])
  const routineState = computed(() => routineFetch.data.value?.tasks ?? [])

  function themeFor(weekday: number) {
    return themesState.value.find((theme) => theme.weekday === weekday)
  }

  async function saveTheme(weekday: number, input: { theme: string; example: string }) {
    await $fetch(`/api/admin/marketing/themes/${weekday}`, { method: 'PUT', body: input })
    await routineFetch.refresh()
  }

  async function addRoutineTask(input: RoutineInput) {
    await $fetch('/api/admin/marketing/routine', { method: 'POST', body: input })
    await routineFetch.refresh()
  }

  async function updateRoutineTask(id: string, input: RoutineInput) {
    await $fetch(`/api/admin/marketing/routine/${id}`, { method: 'PATCH', body: input })
    await routineFetch.refresh()
  }

  async function deleteRoutineTask(id: string) {
    await $fetch(`/api/admin/marketing/routine/${id}`, { method: 'DELETE' })
    await routineFetch.refresh()
  }

  return { themesState, routineState, themeFor, saveTheme, addRoutineTask, updateRoutineTask, deleteRoutineTask }
}

export function useMarketingPlaybook() {
  const playbookFetch = useFetch<PlaybookItem[]>('/api/admin/marketing/playbook', {
    default: () => [],
  })
  const itemsState = computed(() => playbookFetch.data.value ?? [])

  function itemsIn(section: PlaybookSection) {
    return itemsState.value.filter((item) => item.section === section)
  }

  async function addItem(input: PlaybookInput) {
    await $fetch('/api/admin/marketing/playbook', { method: 'POST', body: input })
    await playbookFetch.refresh()
  }

  async function updateItem(id: number, input: PlaybookInput) {
    await $fetch(`/api/admin/marketing/playbook/${id}`, { method: 'PATCH', body: input })
    await playbookFetch.refresh()
  }

  async function deleteItem(id: number) {
    await $fetch(`/api/admin/marketing/playbook/${id}`, { method: 'DELETE' })
    await playbookFetch.refresh()
  }

  return { itemsState, itemsIn, addItem, updateItem, deleteItem }
}

export function useStaff() {
  const staffFetch = useFetch<StaffAccount[]>('/api/admin/staff', { default: () => [] })
  const staffState = computed(() => staffFetch.data.value ?? [])

  async function addStaff(input: StaffAccountInput & { name: string; password: string }) {
    await $fetch('/api/admin/staff', { method: 'POST', body: input })
    await staffFetch.refresh()
  }

  async function updateStaff(id: number, input: StaffAccountInput) {
    await $fetch(`/api/admin/staff/${id}`, { method: 'PATCH', body: input })
    await staffFetch.refresh()
  }

  async function setStaffPassword(id: number, password: string) {
    await $fetch(`/api/admin/staff/${id}/password`, { method: 'POST', body: { password } })
    await staffFetch.refresh()
  }

  async function removeStaffLogin(id: number) {
    await $fetch(`/api/admin/staff/${id}/password`, { method: 'POST', body: { remove: true } })
    await staffFetch.refresh()
  }

  return { staffState, addStaff, updateStaff, setStaffPassword, removeStaffLogin }
}

// Turns an API error into the server's message, for showing in forms.
export function apiErrorMessage(error: unknown, fallback = 'Something went wrong — please try again.') {
  return (error as { data?: { statusMessage?: string } }).data?.statusMessage ?? fallback
}
