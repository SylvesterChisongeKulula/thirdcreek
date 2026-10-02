<script setup lang="ts">
import { Megaphone, GraduationCap, Handshake, SquareCheck, Pencil } from '@lucide/vue'
import { weekdayNames, type PlaybookItem, type PlaybookSection } from '~/data/marketing'
import type { PlaybookInput } from '~/composables/useMarketing'

definePageMeta({ title: 'Marketing Playbook' })

const { itemsIn, addItem, updateItem, deleteItem } = useMarketingPlaybook()
const { themesState } = useMarketingRoutine()
const { user } = useAuth()

const isOwner = computed(() => user.value?.authRole === 'owner')
const editing = ref(false)

const principleIcons = [Megaphone, GraduationCap, Handshake]

const mission = computed(() => itemsIn('mission')[0])
const dailyExtra = computed(() => itemsIn('daily_extra')[0])

const showModal = ref(false)
const modalSection = ref<PlaybookSection>('mission')
const modalItem = ref<PlaybookItem | null>(null)
const modalRef = ref<{ setError: (message: string) => void } | null>(null)

function openAdd(section: PlaybookSection) {
  modalSection.value = section
  modalItem.value = null
  showModal.value = true
}

function openEdit(item: PlaybookItem) {
  modalSection.value = item.section
  modalItem.value = item
  showModal.value = true
}

async function onSubmit(input: PlaybookInput) {
  try {
    if (modalItem.value) await updateItem(modalItem.value.id, input)
    else await addItem(input)
    showModal.value = false
  } catch (error) {
    modalRef.value?.setError(apiErrorMessage(error))
  }
}

async function onDelete(item: PlaybookItem) {
  if (confirm(`Delete "${item.title || item.body}" from the playbook?`)) await deleteItem(item.id)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div v-if="isOwner" class="flex justify-end">
      <button type="button" class="filter-chip inline-flex items-center gap-2" :class="{ 'filter-chip-active': editing }" @click="editing = !editing">
        <Pencil :size="14" /> {{ editing ? 'Done editing' : 'Edit playbook' }}
      </button>
    </div>

    <div class="crm-panel">
      <div class="mb-2 flex items-center justify-between gap-2">
        <p class="label-uppercase text-muted">Strategy at a Glance</p>
        <PlaybookItemControls v-if="editing && mission" @edit="openEdit(mission)" />
      </div>
      <p class="max-w-3xl whitespace-pre-line font-body text-[15px] leading-relaxed text-ink">{{ mission?.body }}</p>
    </div>

    <div>
      <PlaybookSectionHeading v-if="editing" section="principle" :editing="editing" @add="openAdd('principle')" />
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div v-for="(item, index) in itemsIn('principle')" :key="item.id" class="kpi-card">
          <div class="flex items-center justify-between gap-2">
            <span class="label-uppercase text-muted">{{ item.title }}</span>
            <PlaybookItemControls v-if="editing" deletable @edit="openEdit(item)" @delete="onDelete(item)" />
            <component :is="principleIcons[index % principleIcons.length]" v-else :size="18" class="text-muted" />
          </div>
          <p class="font-display text-xl font-bold text-ink">{{ item.details.value }}</p>
          <p class="text-[13px] text-muted">{{ item.body }}</p>
        </div>
      </div>
    </div>

    <div class="crm-panel">
      <div class="mb-4 flex items-center justify-between gap-2">
        <p class="label-uppercase text-muted">Weekly Posting Rhythm</p>
        <NuxtLink to="/admin/marketing/routine" class="text-link-cta">{{ isOwner ? 'Edit in Routine →' : 'See routine →' }}</NuxtLink>
      </div>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <div v-for="day in themesState" :key="day.weekday" class="border border-hairline bg-surface-soft p-4">
          <p class="text-[12px] font-bold uppercase tracking-wide text-muted">{{ weekdayNames[day.weekday] }}</p>
          <p class="mt-1 font-display text-[15px] font-bold text-ink">{{ day.theme }}</p>
          <p class="mt-2 text-[13px] text-muted">{{ day.example }}</p>
        </div>
      </div>
      <div class="mt-4 flex items-start gap-2">
        <p class="whitespace-pre-line text-[13px] text-ink">{{ dailyExtra?.body }}</p>
        <PlaybookItemControls v-if="editing && dailyExtra" @edit="openEdit(dailyExtra)" />
      </div>
    </div>

    <div>
      <PlaybookSectionHeading section="content_pillar" :editing="editing" @add="openAdd('content_pillar')" />
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div v-for="item in itemsIn('content_pillar')" :key="item.id" class="crm-panel">
          <div class="flex items-start justify-between gap-2">
            <p class="font-display text-[17px] font-bold text-ink">{{ item.title }}</p>
            <PlaybookItemControls v-if="editing" deletable @edit="openEdit(item)" @delete="onDelete(item)" />
          </div>
          <p class="mt-1 text-[13px] text-muted">{{ item.body }}</p>
          <ul class="mt-4 flex flex-col gap-2">
            <li v-for="idea in item.details.ideas" :key="idea" class="flex gap-2 text-[14px] text-ink">
              <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{{ idea }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="crm-panel">
      <PlaybookSectionHeading section="format" :editing="editing" @add="openAdd('format')" />
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="item in itemsIn('format')" :key="item.id">
          <div class="flex items-start justify-between gap-2">
            <p class="font-display text-[15px] font-bold text-ink">{{ item.title }}</p>
            <PlaybookItemControls v-if="editing" deletable @edit="openEdit(item)" @delete="onDelete(item)" />
          </div>
          <p class="mt-1 text-[13px] text-muted">{{ item.body }}</p>
        </div>
      </div>
    </div>

    <div>
      <PlaybookSectionHeading section="partnership" :editing="editing" @add="openAdd('partnership')" />
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div
          v-for="item in itemsIn('partnership')"
          :key="item.id"
          class="crm-panel"
          :class="{ 'border-primary': item.details.highlight }"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="flex flex-wrap items-center gap-2">
              <p class="font-display text-[17px] font-bold text-ink">{{ item.title }}</p>
              <span v-if="item.details.highlight" class="bg-primary px-2 py-0.5 text-[11px] font-semibold text-on-primary">
                {{ item.details.highlight }}
              </span>
            </div>
            <PlaybookItemControls v-if="editing" deletable @edit="openEdit(item)" @delete="onDelete(item)" />
          </div>
          <p class="mt-2 text-[14px] text-ink">{{ item.body }}</p>
          <dl class="mt-4 grid grid-cols-1 gap-3 text-[13px] sm:grid-cols-3">
            <div>
              <dt class="font-bold text-muted">We give</dt>
              <dd class="mt-0.5 text-ink">{{ item.details.weGive }}</dd>
            </div>
            <div>
              <dt class="font-bold text-muted">They give</dt>
              <dd class="mt-0.5 text-ink">{{ item.details.theyGive }}</dd>
            </div>
            <div>
              <dt class="font-bold text-muted">How we track it</dt>
              <dd class="mt-0.5 text-ink">{{ item.details.tracking }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="crm-panel">
        <PlaybookSectionHeading section="partner_criterion" :editing="editing" @add="openAdd('partner_criterion')" />
        <ul class="flex flex-col gap-2">
          <li v-for="item in itemsIn('partner_criterion')" :key="item.id" class="flex gap-2 text-[14px] text-ink">
            <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span class="flex-1">{{ item.body }}</span>
            <PlaybookItemControls v-if="editing" deletable @edit="openEdit(item)" @delete="onDelete(item)" />
          </li>
        </ul>
      </div>

      <div class="crm-panel lg:col-span-2">
        <PlaybookSectionHeading section="outreach_step" :editing="editing" @add="openAdd('outreach_step')" />
        <ol class="flex flex-col gap-4">
          <li v-for="(item, index) in itemsIn('outreach_step')" :key="item.id" class="flex gap-4">
            <span
              class="flex h-7 w-7 shrink-0 items-center justify-center bg-primary font-display text-[13px] font-bold text-on-primary"
            >
              {{ index + 1 }}
            </span>
            <div class="flex-1">
              <p class="font-display text-[15px] font-bold text-ink">{{ item.title }}</p>
              <p class="text-[13px] text-muted">{{ item.body }}</p>
            </div>
            <PlaybookItemControls v-if="editing" deletable @edit="openEdit(item)" @delete="onDelete(item)" />
          </li>
        </ol>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="crm-panel overflow-x-auto lg:col-span-2">
        <PlaybookSectionHeading section="metric" :editing="editing" @add="openAdd('metric')" />
        <table class="w-full text-left text-[14px]">
          <thead>
            <tr class="border-b border-hairline text-[12px] text-muted">
              <th class="pb-2 pr-4 font-normal">Metric</th>
              <th class="pb-2 pr-4 font-normal">Why it matters</th>
              <th class="pb-2 font-normal">How to measure</th>
              <th v-if="editing" class="pb-2" />
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in itemsIn('metric')" :key="item.id" class="border-b border-hairline last:border-b-0">
              <td class="py-2 pr-4 font-semibold text-ink">{{ item.title }}</td>
              <td class="py-2 pr-4 text-muted">{{ item.details.why }}</td>
              <td class="py-2 text-muted">{{ item.details.howToMeasure }}</td>
              <td v-if="editing" class="py-2 pl-2 text-right">
                <PlaybookItemControls deletable @edit="openEdit(item)" @delete="onDelete(item)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="crm-panel">
        <PlaybookSectionHeading section="checklist" :editing="editing" @add="openAdd('checklist')" />
        <ul class="flex flex-col gap-3">
          <li v-for="item in itemsIn('checklist')" :key="item.id" class="flex gap-2 text-[14px] text-ink">
            <SquareCheck :size="16" class="mt-0.5 shrink-0 text-primary" />
            <span class="flex-1">{{ item.body }}</span>
            <PlaybookItemControls v-if="editing" deletable @edit="openEdit(item)" @delete="onDelete(item)" />
          </li>
        </ul>
      </div>
    </div>

    <PlaybookItemModal ref="modalRef" v-model="showModal" :section="modalSection" :item="modalItem" @submit="onSubmit" />
  </div>
</template>
