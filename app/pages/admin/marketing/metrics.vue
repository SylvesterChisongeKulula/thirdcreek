<script setup lang="ts">
import { Handshake, MessageCircle, UserPlus, TrendingUp } from '@lucide/vue'
import { addDays, leadSources, toISODate, weekStartOf } from '~/data/marketing'
import type { EngagementInput } from '~/composables/useMarketing'

definePageMeta({ title: 'Marketing Metrics' })

const { leadsState } = useCrmData()
const { partnersState } = useMarketingPartners()
const { logsState, saveLog } = useEngagementLogs()

const today = toISODate(new Date())
const thisWeek = weekStartOf(today)

// ── Lead funnel ────────────────────────────────────────────────
const socialLeads = computed(() => leadsState.value.filter(isSocialLead))
const otherLeads = computed(() => leadsState.value.filter((lead) => !isSocialLead(lead)))
const social = computed(() => leadFunnel(socialLeads.value))
const other = computed(() => leadFunnel(otherLeads.value))

const funnelSteps = computed(() => [
  { label: 'Leads', hint: 'Came in from Facebook or a partner', count: social.value.leads, rate: null },
  { label: 'Engaged', hint: 'Contacted, quoted or won', count: social.value.engaged, rate: social.value.engagedRate },
  { label: 'Clients', hint: 'Won — now paying customers', count: social.value.clients, rate: social.value.clientRate },
])

const sourceBreakdown = computed(() =>
  leadSources
    .map((source) => {
      const leads = leadsState.value.filter((lead) => lead.source === source)
      return { source, count: leads.length, won: leads.filter((lead) => lead.stage === 'Won').length }
    })
    .sort((a, b) => b.count - a.count),
)
const maxSourceCount = computed(() => Math.max(...sourceBreakdown.value.map((row) => row.count), 1))

// ── Partners ───────────────────────────────────────────────────
const activePartners = computed(() => partnersState.value.filter((partner) => partner.status === 'Active').length)
const partnerPerformance = computed(() =>
  partnersState.value
    .map((partner) => {
      const referred = leadsState.value.filter((lead) => lead.partnerId === partner.id)
      return {
        id: partner.id,
        name: partner.name,
        status: partner.status,
        referred: referred.length,
        won: referred.filter((lead) => lead.stage === 'Won').length,
      }
    })
    .filter((row) => row.referred > 0 || row.status === 'Active')
    .sort((a, b) => b.won - a.won || b.referred - a.referred),
)

// ── Engagement ────────────────────────────────────────────────
const recentLogs = computed(() => logsState.value.slice(0, 8))
const trend = computed(() =>
  Array.from({ length: 8 }, (_, index) => {
    const weekStart = addDays(thisWeek, -7 * (7 - index))
    const log = logsState.value.find((entry) => entry.weekStart === weekStart)
    return { weekStart, log, interactions: log ? log.comments + log.messages : 0 }
  }),
)
const maxInteractions = computed(() => Math.max(...trend.value.map((week) => week.interactions), 1))
const latestLog = computed(() => logsState.value[0] ?? null)

const shortDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' })
const weekLabel = (weekStart: string) => shortDate.format(new Date(`${weekStart}T00:00:00`))

const form = reactive<EngagementInput>({
  weekStart: thisWeek,
  postsPublished: 0,
  comments: 0,
  messages: 0,
  newFollowers: 0,
  reach: 0,
  notes: '',
})
const saveState = ref<'idle' | 'saving' | 'saved' | 'error'>('idle')

// Pre-fill the form when picking a week that already has numbers, so saving edits rather than wipes it.
watch(
  [() => form.weekStart, logsState],
  () => {
    const existing = logsState.value.find((log) => log.weekStart === weekStartOf(form.weekStart))
    Object.assign(form, {
      postsPublished: existing?.postsPublished ?? 0,
      comments: existing?.comments ?? 0,
      messages: existing?.messages ?? 0,
      newFollowers: existing?.newFollowers ?? 0,
      reach: existing?.reach ?? 0,
      notes: existing?.notes ?? '',
    })
  },
  { immediate: true },
)

const formWeekLogged = computed(() => logsState.value.some((log) => log.weekStart === weekStartOf(form.weekStart)))

async function submitLog() {
  saveState.value = 'saving'
  try {
    await saveLog({ ...form, weekStart: weekStartOf(form.weekStart) })
    saveState.value = 'saved'
  } catch {
    saveState.value = 'error'
  }
}

const engagementFields: { key: keyof Omit<EngagementInput, 'weekStart' | 'notes'>; label: string }[] = [
  { key: 'postsPublished', label: 'Posts published' },
  { key: 'comments', label: 'Comments' },
  { key: 'messages', label: 'Messages' },
  { key: 'newFollowers', label: 'New followers' },
  { key: 'reach', label: 'Reach' },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        label="Active Partners"
        :value="String(activePartners)"
        :delta="`${partnersState.length} partners tracked in total`"
        :icon="Handshake"
      />
      <KpiCard
        label="Social Interactions"
        :value="latestLog ? formatCount(latestLog.comments + latestLog.messages) : '—'"
        :delta="latestLog ? `Comments + messages, week of ${weekLabel(latestLog.weekStart)}` : 'Log a week below to start'"
        :icon="MessageCircle"
      />
      <KpiCard
        label="Social Leads"
        :value="String(social.leads)"
        :delta="`${percent(social.leads, leadsState.length)}% of all leads`"
        :icon="UserPlus"
      />
      <KpiCard
        label="Social Conversion"
        :value="`${social.conversionRate}%`"
        :delta="`vs ${other.conversionRate}% for other sources`"
        :trend="social.conversionRate > other.conversionRate ? 'up' : social.conversionRate < other.conversionRate ? 'down' : 'flat'"
        :icon="TrendingUp"
      />
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="crm-panel">
        <p class="label-uppercase text-muted mb-1">Social Lead Funnel</p>
        <p class="mb-5 text-[13px] text-muted">Leads from Facebook and partner referrals, by how far they've got</p>
        <div class="flex flex-col gap-4">
          <div v-for="step in funnelSteps" :key="step.label" :title="`${step.label}: ${step.count}`">
            <div class="mb-1 flex items-baseline justify-between gap-2 text-[13px]">
              <span>
                <span class="font-semibold text-ink">{{ step.label }}</span>
                <span class="ml-2 text-muted">{{ step.hint }}</span>
              </span>
              <span class="shrink-0 text-muted">
                <span class="font-semibold text-ink">{{ step.count }}</span>
                <span v-if="step.rate !== null"> · {{ step.rate }}% of previous</span>
              </span>
            </div>
            <div class="h-3 w-full bg-surface-strong">
              <div class="h-3 rounded-r-[4px] bg-primary" :style="{ width: `${percent(step.count, social.leads)}%` }" />
            </div>
          </div>
        </div>

        <table class="mt-6 w-full text-left text-[13px]">
          <thead>
            <tr class="border-b border-hairline text-[12px] text-muted">
              <th class="pb-2 font-normal">Compared with</th>
              <th class="pb-2 text-right font-normal">Leads</th>
              <th class="pb-2 text-right font-normal">Engaged</th>
              <th class="pb-2 text-right font-normal">Clients</th>
              <th class="pb-2 text-right font-normal">Lost</th>
              <th class="pb-2 text-right font-normal">Conversion</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-hairline">
              <td class="py-2 font-semibold text-ink">Social</td>
              <td class="py-2 text-right text-ink">{{ social.leads }}</td>
              <td class="py-2 text-right text-ink">{{ social.engaged }}</td>
              <td class="py-2 text-right text-ink">{{ social.clients }}</td>
              <td class="py-2 text-right text-muted">{{ social.lost }}</td>
              <td class="py-2 text-right font-semibold text-ink">{{ social.conversionRate }}%</td>
            </tr>
            <tr>
              <td class="py-2 text-ink">Other sources</td>
              <td class="py-2 text-right text-ink">{{ other.leads }}</td>
              <td class="py-2 text-right text-ink">{{ other.engaged }}</td>
              <td class="py-2 text-right text-ink">{{ other.clients }}</td>
              <td class="py-2 text-right text-muted">{{ other.lost }}</td>
              <td class="py-2 text-right font-semibold text-ink">{{ other.conversionRate }}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="crm-panel">
        <p class="label-uppercase text-muted mb-1">Leads by Source</p>
        <p class="mb-5 text-[13px] text-muted">Where every lead in the pipeline came from</p>
        <div class="flex flex-col gap-4">
          <div v-for="row in sourceBreakdown" :key="row.source" :title="`${row.source}: ${row.count} leads, ${row.won} won`">
            <div class="mb-1 flex items-center justify-between text-[13px]">
              <span class="text-ink">{{ row.source }}</span>
              <span class="text-muted">
                <span class="font-semibold text-ink">{{ row.count }}</span> · {{ row.won }} won
              </span>
            </div>
            <div class="h-2 w-full bg-surface-strong">
              <div class="h-2 rounded-r-[4px] bg-primary" :style="{ width: `${(row.count / maxSourceCount) * 100}%` }" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="crm-panel lg:col-span-2">
        <p class="label-uppercase text-muted mb-1">Social Interactions</p>
        <p class="mb-5 text-[13px] text-muted">Comments + messages per week, last 8 weeks</p>
        <div class="flex h-40 items-end gap-[2px]">
          <div
            v-for="week in trend"
            :key="week.weekStart"
            class="group relative flex h-full flex-1 flex-col justify-end"
            :title="
              week.log
                ? `Week of ${weekLabel(week.weekStart)}: ${week.log.comments} comments, ${week.log.messages} messages`
                : `Week of ${weekLabel(week.weekStart)}: not logged`
            "
          >
            <span
              v-if="week.log"
              class="mb-1 text-center text-[11px] text-muted opacity-0 transition-opacity group-hover:opacity-100"
            >
              {{ formatCount(week.interactions) }}
            </span>
            <div
              v-if="week.log"
              class="w-full rounded-t-[4px] bg-primary transition-opacity group-hover:opacity-80"
              :style="{ height: `${Math.max((week.interactions / maxInteractions) * 100, 2)}%` }"
            />
            <div v-else class="h-[2px] w-full bg-hairline-strong" />
          </div>
        </div>
        <div class="mt-2 flex gap-[2px] border-t border-hairline pt-2">
          <span v-for="week in trend" :key="week.weekStart" class="flex-1 text-center text-[11px] text-muted">
            {{ weekLabel(week.weekStart) }}
          </span>
        </div>

        <div class="mt-6 overflow-x-auto">
          <table class="w-full min-w-[560px] text-left text-[13px]">
            <thead>
              <tr class="border-b border-hairline text-[12px] text-muted">
                <th class="pb-2 font-normal">Week of</th>
                <th v-for="field in engagementFields" :key="field.key" class="pb-2 text-right font-normal">
                  {{ field.label }}
                </th>
                <th class="pb-2 pl-3 font-normal">Logged by</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in recentLogs" :key="log.id" class="border-b border-hairline last:border-b-0">
                <td class="py-2 text-ink">{{ weekLabel(log.weekStart) }}</td>
                <td v-for="field in engagementFields" :key="field.key" class="py-2 text-right text-ink">
                  {{ formatCount(log[field.key]) }}
                </td>
                <td class="py-2 pl-3 text-muted">{{ log.loggedBy }}</td>
              </tr>
            </tbody>
          </table>
          <p v-if="recentLogs.length === 0" class="py-4 text-center text-[13px] text-muted">No weeks logged yet.</p>
        </div>
      </div>

      <div class="crm-panel">
        <p class="label-uppercase text-muted mb-1">Log a Week</p>
        <p class="mb-4 text-[13px] text-muted">Copy the numbers from Meta Business Suite → Insights.</p>
        <form class="flex flex-col gap-3" @submit.prevent="submitLog">
          <label class="flex flex-col gap-1 text-[13px] text-muted">
            Any day in the week
            <input v-model="form.weekStart" type="date" class="text-input" required @input="saveState = 'idle'" />
          </label>
          <p class="text-[12px] text-muted">
            Week of {{ weekLabel(weekStartOf(form.weekStart || thisWeek)) }}
            <span v-if="formWeekLogged"> · already logged, saving will update it</span>
          </p>
          <div class="grid grid-cols-2 gap-3">
            <label v-for="field in engagementFields" :key="field.key" class="flex flex-col gap-1 text-[13px] text-muted">
              {{ field.label }}
              <input
                v-model.number="form[field.key]"
                type="number"
                min="0"
                class="text-input !px-3 !py-2"
                @input="saveState = 'idle'"
              />
            </label>
          </div>
          <textarea v-model="form.notes" rows="2" placeholder="Notes: best post, anything unusual" class="text-input" />
          <button type="submit" class="btn-primary" :disabled="saveState === 'saving'">
            {{ saveState === 'saving' ? 'Saving…' : formWeekLogged ? 'Update Week' : 'Save Week' }}
          </button>
          <p v-if="saveState === 'saved'" class="text-[13px] text-success">Saved.</p>
          <p v-if="saveState === 'error'" class="text-[13px] text-error">Couldn't save — please try again.</p>
        </form>
      </div>
    </div>

    <div class="crm-panel overflow-x-auto">
      <p class="label-uppercase text-muted mb-4">Partner Performance</p>
      <table class="w-full min-w-[480px] text-left text-[14px]">
        <thead>
          <tr class="border-b border-hairline text-[12px] text-muted">
            <th class="pb-2 font-normal">Partner</th>
            <th class="pb-2 font-normal">Status</th>
            <th class="pb-2 text-right font-normal">Leads referred</th>
            <th class="pb-2 text-right font-normal">Won</th>
            <th class="pb-2 text-right font-normal">Conversion</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in partnerPerformance" :key="row.id" class="border-b border-hairline last:border-b-0">
            <td class="py-2 font-semibold text-ink">{{ row.name }}</td>
            <td class="py-2">
              <span class="px-1.5 py-0.5 text-[11px] font-semibold" :class="partnerStatusClasses[row.status]">
                {{ row.status }}
              </span>
            </td>
            <td class="py-2 text-right text-ink">{{ row.referred }}</td>
            <td class="py-2 text-right text-ink">{{ row.won }}</td>
            <td class="py-2 text-right text-ink">{{ percent(row.won, row.referred) }}%</td>
          </tr>
        </tbody>
      </table>
      <p v-if="partnerPerformance.length === 0" class="py-4 text-center text-[13px] text-muted">
        No partner referrals yet. Choose "Partner referral" as the source when adding a lead.
      </p>
    </div>
  </div>
</template>
