<script setup lang="ts">
import { Handshake, MessageCircle, UserPlus, TrendingUp, CalendarDays, BarChart3, BookOpen } from '@lucide/vue'
import { addDays, isWeekend, nextWorkday, toISODate, weekStartOf, weekdayNames, workweekday } from '~/data/marketing'

definePageMeta({ title: 'Marketing' })

const today = toISODate(new Date())
const range = ref({ from: addDays(today, -7), to: today })

const { tasksState, setTaskDone, deleteTask } = useMarketingTasks(range)
const { partnersState } = useMarketingPartners()
const { logsState } = useEngagementLogs()
const { leadsState } = useCrmData()
const { themeFor } = useMarketingRoutine()

const weekend = isWeekend(today)
const upcomingDay = workweekday(nextWorkday(today))
const todayTheme = computed(() => themeFor(workweekday(today))?.theme ?? '')
const upcomingTheme = computed(() => themeFor(upcomingDay)?.theme ?? '')

const todayTasks = computed(() => tasksState.value.filter((task) => task.date === today))
const todayDone = computed(() => todayTasks.value.filter((task) => task.completedBy).length)
// Routine rows are created when a date is first viewed, so only count tasks that existed on their due
// date — otherwise the first visit would flag a week of tasks from before anyone used the calendar.
const overdueTasks = computed(() =>
  tasksState.value
    .filter((task) => task.date < today && !task.completedBy && task.createdAt <= task.date)
    .sort((a, b) => (a.date < b.date ? 1 : -1)),
)

const activePartners = computed(() => partnersState.value.filter((partner) => partner.status === 'Active').length)
const partnersInProgress = computed(
  () => partnersState.value.filter((partner) => ['Contacted', 'Trial'].includes(partner.status)).length,
)

const thisWeek = weekStartOf(today)
const latestLog = computed(() => logsState.value[0] ?? null)
const interactionsLabel = computed(() => {
  if (!latestLog.value) return 'No engagement logged yet'
  return latestLog.value.weekStart === thisWeek ? 'Comments + messages this week' : `Week of ${latestLog.value.weekStart}`
})

const socialLeads = computed(() => leadsState.value.filter(isSocialLead))
const monthPrefix = today.slice(0, 7)
const socialLeadsThisMonth = computed(() => socialLeads.value.filter((lead) => lead.createdAt.startsWith(monthPrefix)).length)
const socialFunnel = computed(() => leadFunnel(socialLeads.value))

async function onDelete(id: number) {
  if (confirm('Delete this task?')) await deleteTask(id)
}

const shortcuts = [
  { to: '/admin/marketing/calendar', label: 'Plan the week', icon: CalendarDays },
  { to: '/admin/marketing/partners', label: 'Manage partners', icon: Handshake },
  { to: '/admin/marketing/metrics', label: 'Log & review metrics', icon: BarChart3 },
  { to: '/admin/marketing/playbook', label: 'Read the playbook', icon: BookOpen },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        label="Active Partners"
        :value="String(activePartners)"
        :delta="`${partnersInProgress} in talks or on trial`"
        :icon="Handshake"
      />
      <KpiCard
        label="Social Interactions"
        :value="latestLog ? formatCount(latestLog.comments + latestLog.messages) : '—'"
        :delta="interactionsLabel"
        :icon="MessageCircle"
      />
      <KpiCard
        label="Social Leads"
        :value="String(socialLeadsThisMonth)"
        :delta="`This month · ${socialFunnel.leads} all time`"
        :icon="UserPlus"
      />
      <KpiCard
        label="Social Conversion"
        :value="`${socialFunnel.conversionRate}%`"
        :delta="`${socialFunnel.clients} of ${socialFunnel.leads} social leads became clients`"
        :icon="TrendingUp"
      />
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="crm-panel lg:col-span-2">
        <div class="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p class="label-uppercase text-muted">Today</p>
            <p class="font-display text-lg font-bold text-ink">{{ weekend ? 'Weekend' : todayTheme }}</p>
          </div>
          <p v-if="!weekend" class="text-[13px] text-muted">
            <span class="font-semibold text-ink">{{ todayDone }} of {{ todayTasks.length }}</span> done
          </p>
        </div>
        <p v-if="weekend" class="py-4 text-[14px] text-muted">
          No scheduled tasks — the marketing week runs Monday to Friday. Next up on {{ weekdayNames[upcomingDay] }}:
          <span class="font-semibold text-ink">{{ upcomingTheme }}</span>.
        </p>
        <div v-else class="mb-2 h-1.5 w-full bg-surface-strong">
          <div
            class="h-1.5 bg-success transition-all"
            :style="{ width: `${percent(todayDone, todayTasks.length)}%` }"
          />
        </div>
        <div class="divide-y divide-hairline">
          <MarketingTaskItem
            v-for="task in todayTasks"
            :key="task.id"
            :task="task"
            @toggle="setTaskDone(task.id, $event)"
            @delete="onDelete(task.id)"
          />
        </div>
        <NuxtLink to="/admin/marketing/calendar" class="text-link-cta mt-4">Open calendar →</NuxtLink>
      </div>

      <div class="flex flex-col gap-6">
        <div class="crm-panel">
          <p class="label-uppercase text-muted mb-1">Overdue</p>
          <p class="mb-2 text-[13px] text-muted">Unfinished tasks from the last 7 days</p>
          <div class="max-h-80 divide-y divide-hairline overflow-y-auto">
            <MarketingTaskItem
              v-for="task in overdueTasks"
              :key="task.id"
              :task="task"
              show-date
              compact
              @toggle="setTaskDone(task.id, $event)"
              @delete="onDelete(task.id)"
            />
          </div>
          <p v-if="overdueTasks.length === 0" class="text-[13px] text-success">All caught up.</p>
        </div>

        <div class="crm-panel">
          <p class="label-uppercase text-muted mb-3">Shortcuts</p>
          <div class="flex flex-col gap-1">
            <NuxtLink
              v-for="shortcut in shortcuts"
              :key="shortcut.to"
              :to="shortcut.to"
              class="flex items-center gap-3 px-2 py-2 text-[14px] text-ink transition-colors hover:bg-surface-soft"
            >
              <component :is="shortcut.icon" :size="16" class="text-muted" />
              {{ shortcut.label }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
