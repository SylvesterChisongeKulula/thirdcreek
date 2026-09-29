<script setup lang="ts">
import { Wallet, TrendingUp, Users, FileText } from '@lucide/vue'
import type { StoreLocation } from '~/data/crm-contacts'

definePageMeta({ layout: 'admin', title: 'Dashboard' })

const { contactsState, leadsState } = useCrmData()

const activeLeads = computed(
  () => leadsState.value.filter((lead) => lead.stage !== 'Won' && lead.stage !== 'Lost').length,
)
const quotesPending = computed(() => leadsState.value.filter((lead) => lead.stage === 'Quoted').length)

const wonCount = computed(() => leadsState.value.filter((lead) => lead.stage === 'Won').length)
const lostCount = computed(() => leadsState.value.filter((lead) => lead.stage === 'Lost').length)
const conversionRate = computed(() => {
  const closed = wonCount.value + lostCount.value
  return closed === 0 ? 0 : Math.round((wonCount.value / closed) * 100)
})

const clientTotals = computed(() =>
  contactsState.value
    .map((contact) => ({
      name: contact.name,
      location: contact.location,
      total: contact.purchaseHistory.reduce((sum, record) => sum + record.amount, 0),
      lastOrder: contact.purchaseHistory.reduce<string | null>(
        (latest, record) => (!latest || record.date > latest ? record.date : latest),
        null,
      ),
    }))
    .filter((client) => client.total > 0)
    .sort((a, b) => b.total - a.total),
)

const topClients = computed(() => clientTotals.value.slice(0, 4))

const salesByLocation = computed(() => {
  const totals: Record<StoreLocation, number> = { Kabwata: 0, Chalala: 0, 'Ibex Hill (Meanwood)': 0 }
  for (const client of clientTotals.value) {
    totals[client.location] += client.total
  }
  return totals
})

const maxLocationTotal = computed(() => Math.max(...Object.values(salesByLocation.value), 1))

const recentActivity = computed(() =>
  contactsState.value
    .flatMap((contact) => contact.notes.map((note) => ({ ...note, contactName: contact.name })))
    .sort((a, b) => (a.date > b.date ? -1 : 1))
    .slice(0, 6),
)

const currency = (value: number) =>
  new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW', maximumFractionDigits: 0 }).format(value)
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard label="Sales This Month" value="ZMW 18,400" delta="+12% vs last month" trend="up" :icon="Wallet" />
      <KpiCard label="Active Leads" :value="String(activeLeads)" delta="Across 3 locations" :icon="TrendingUp" />
      <KpiCard label="Total Contacts" :value="String(contactsState.length)" delta="+4 this quarter" trend="up" :icon="Users" />
      <KpiCard label="Quotes Pending" :value="String(quotesPending)" delta="Awaiting client response" :icon="FileText" />
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="flex flex-col gap-6 lg:col-span-2">
        <div class="crm-panel">
          <p class="label-uppercase text-muted mb-4">Sales by Location</p>
          <div class="flex flex-col gap-4">
            <div v-for="(total, location) in salesByLocation" :key="location">
              <div class="mb-1 flex items-center justify-between text-[13px]">
                <span class="text-ink">{{ location }}</span>
                <span class="font-semibold text-ink">{{ currency(total) }}</span>
              </div>
              <div class="h-2 w-full bg-surface-strong">
                <div class="h-2 bg-primary" :style="{ width: `${(total / maxLocationTotal) * 100}%` }" />
              </div>
            </div>
          </div>
        </div>

        <div class="crm-panel">
          <p class="label-uppercase text-muted mb-4">Top Clients</p>
          <table class="w-full text-left text-[14px]">
            <thead>
              <tr class="border-b border-hairline text-[12px] text-muted">
                <th class="pb-2 font-normal">Client</th>
                <th class="pb-2 font-normal">Location</th>
                <th class="pb-2 font-normal">Total Spend</th>
                <th class="pb-2 font-normal">Last Order</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="client in topClients" :key="client.name" class="border-b border-hairline last:border-b-0">
                <td class="py-2 text-ink">{{ client.name }}</td>
                <td class="py-2 text-muted">{{ client.location }}</td>
                <td class="py-2 font-semibold text-ink">{{ currency(client.total) }}</td>
                <td class="py-2 text-muted">{{ client.lastOrder }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex flex-col gap-6">
        <div class="crm-panel">
          <p class="label-uppercase text-muted mb-2">Lead Conversion</p>
          <p class="font-display text-3xl font-bold text-ink">{{ conversionRate }}%</p>
          <p class="mt-1 text-[13px] text-muted">{{ wonCount }} won · {{ lostCount }} lost this period</p>
        </div>

        <div class="crm-panel">
          <p class="label-uppercase text-muted mb-2">Recent Activity</p>
          <ActivityItem
            v-for="(item, index) in recentActivity"
            :key="index"
            :date="item.date"
            :author="item.contactName"
            :text="item.text"
          />
        </div>
      </div>
    </div>
  </div>
</template>
