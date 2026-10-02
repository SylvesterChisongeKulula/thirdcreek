<script setup lang="ts">
import { Package, Users, PhoneCall, FileText } from '@lucide/vue'
import { storeLocations, type StoreLocation } from '~/data/crm-contacts'
import type { Lead, LeadStage } from '~/data/crm-leads'

definePageMeta({ layout: 'admin', title: 'Dashboard' })

const { contactsState, leadsState } = useCrmData()
const { productsState } = useAdminProducts()
const { user } = useAuth()

const countStage = (leads: Lead[], stage: LeadStage) => leads.filter((lead) => lead.stage === stage).length
const isOpen = (lead: Lead) => lead.stage !== 'Won' && lead.stage !== 'Lost'

const categoryCount = computed(() => new Set(productsState.value.map((product) => product.category)).size)

const newClientsThisMonth = computed(() => {
  const monthPrefix = new Date().toISOString().slice(0, 7)
  return contactsState.value.filter((contact) => contact.createdAt.startsWith(monthPrefix)).length
})

const toContact = computed(() => countStage(leadsState.value, 'New Lead'))
const quotesToSend = computed(() => countStage(leadsState.value, 'Contacted'))
const awaitingResponse = computed(() => countStage(leadsState.value, 'Quoted'))
const wonCount = computed(() => countStage(leadsState.value, 'Won'))
const lostCount = computed(() => countStage(leadsState.value, 'Lost'))
const openCount = computed(() => leadsState.value.filter(isOpen).length)

const totalLeads = computed(() => leadsState.value.length)
const conversionRate = computed(() =>
  totalLeads.value === 0 ? 0 : Math.round((wonCount.value / totalLeads.value) * 100),
)
const leadShare = (count: number) => (totalLeads.value === 0 ? 0 : (count / totalLeads.value) * 100)

const visibleLocations = computed<StoreLocation[]>(() =>
  user.value?.authRole === 'staff' ? [user.value.location] : storeLocations,
)

const branchStats = computed(() =>
  visibleLocations.value.map((location) => {
    const leads = leadsState.value.filter((lead) => lead.location === location)
    return {
      location,
      clients: contactsState.value.filter((contact) => contact.location === location).length,
      openLeads: leads.filter(isOpen).length,
      toContact: countStage(leads, 'New Lead'),
      quotesToSend: countStage(leads, 'Contacted'),
      awaiting: countStage(leads, 'Quoted'),
      won: countStage(leads, 'Won'),
      lost: countStage(leads, 'Lost'),
    }
  }),
)

const maxBranchClients = computed(() => Math.max(...branchStats.value.map((branch) => branch.clients), 1))

const topBranch = computed(() => {
  if (branchStats.value.length < 2) return null
  const sorted = [...branchStats.value].sort((a, b) => b.clients - a.clients)
  const [first, second] = sorted
  return first && first.clients > 0 && first.clients !== second?.clients ? first.location : null
})

const recentActivity = computed(() =>
  contactsState.value
    .flatMap((contact) => contact.notes.map((note) => ({ ...note, contactName: contact.name })))
    .sort((a, b) => (a.date > b.date ? -1 : 1))
    .slice(0, 6),
)
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        label="Products Available"
        :value="String(productsState.length)"
        :delta="`Across ${categoryCount} ${categoryCount === 1 ? 'category' : 'categories'}`"
        :icon="Package"
      />
      <KpiCard
        label="Total Clients"
        :value="String(contactsState.length)"
        :delta="newClientsThisMonth > 0 ? `+${newClientsThisMonth} this month` : 'No new clients this month'"
        :trend="newClientsThisMonth > 0 ? 'up' : 'flat'"
        :icon="Users"
      />
      <KpiCard label="To Contact" :value="String(toContact)" delta="Leads awaiting first contact" :icon="PhoneCall" />
      <KpiCard
        label="Quotes to Send"
        :value="String(quotesToSend)"
        :delta="`${awaitingResponse} awaiting client response`"
        :icon="FileText"
      />
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="flex flex-col gap-6 lg:col-span-2">
        <div class="crm-panel">
          <p class="label-uppercase text-muted mb-4">Clients by Branch</p>
          <div class="flex flex-col gap-4">
            <div v-for="branch in branchStats" :key="branch.location">
              <div class="mb-1 flex items-center justify-between text-[13px]">
                <span class="text-ink">
                  {{ branch.location }}
                  <span
                    v-if="branch.location === topBranch"
                    class="ml-2 bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-on-primary"
                  >
                    Most clients
                  </span>
                </span>
                <span class="text-muted">
                  <span class="font-semibold text-ink">{{ branch.clients }}</span>
                  {{ branch.clients === 1 ? 'client' : 'clients' }} · {{ branch.openLeads }} open
                  {{ branch.openLeads === 1 ? 'lead' : 'leads' }}
                </span>
              </div>
              <div class="h-2 w-full bg-surface-strong">
                <div class="h-2 bg-primary" :style="{ width: `${(branch.clients / maxBranchClients) * 100}%` }" />
              </div>
            </div>
          </div>
        </div>

        <div class="crm-panel overflow-x-auto">
          <p class="label-uppercase text-muted mb-4">Branch Pipeline</p>
          <table class="w-full text-left text-[14px]">
            <thead>
              <tr class="border-b border-hairline text-[12px] text-muted">
                <th class="pb-2 font-normal">Branch</th>
                <th class="pb-2 text-right font-normal">Clients</th>
                <th class="pb-2 text-right font-normal">To Contact</th>
                <th class="pb-2 text-right font-normal">Quotes to Send</th>
                <th class="pb-2 text-right font-normal">Awaiting</th>
                <th class="pb-2 text-right font-normal">Won</th>
                <th class="pb-2 text-right font-normal">Lost</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="branch in branchStats" :key="branch.location" class="border-b border-hairline last:border-b-0">
                <td class="py-2 text-ink">{{ branch.location }}</td>
                <td class="py-2 text-right font-semibold text-ink">{{ branch.clients }}</td>
                <td class="py-2 text-right text-ink">{{ branch.toContact }}</td>
                <td class="py-2 text-right text-ink">{{ branch.quotesToSend }}</td>
                <td class="py-2 text-right text-ink">{{ branch.awaiting }}</td>
                <td class="py-2 text-right text-ink">{{ branch.won }}</td>
                <td class="py-2 text-right text-muted">{{ branch.lost }}</td>
              </tr>
            </tbody>
            <tfoot v-if="branchStats.length > 1">
              <tr class="border-t border-hairline font-semibold text-ink">
                <td class="pt-2">Total</td>
                <td class="pt-2 text-right">{{ contactsState.length }}</td>
                <td class="pt-2 text-right">{{ toContact }}</td>
                <td class="pt-2 text-right">{{ quotesToSend }}</td>
                <td class="pt-2 text-right">{{ awaitingResponse }}</td>
                <td class="pt-2 text-right">{{ wonCount }}</td>
                <td class="pt-2 text-right">{{ lostCount }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div class="flex flex-col gap-6">
        <div class="crm-panel">
          <p class="label-uppercase text-muted mb-2">Lead Conversion</p>
          <p class="font-display text-3xl font-bold text-ink">{{ conversionRate }}%</p>
          <p class="mt-1 text-[13px] text-muted">
            of {{ totalLeads }} {{ totalLeads === 1 ? 'lead' : 'leads' }} became paying clients
          </p>
          <div class="mt-4 flex h-2 w-full bg-surface-strong">
            <div class="h-2 bg-primary" :style="{ width: `${leadShare(wonCount)}%` }" />
            <div class="h-2 bg-primary/30" :style="{ width: `${leadShare(openCount)}%` }" />
          </div>
          <p class="mt-2 text-[13px] text-muted">
            {{ wonCount }} won · {{ openCount }} still open · {{ lostCount }} lost
          </p>
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
          <p v-if="recentActivity.length === 0" class="text-[13px] text-muted">No activity yet.</p>
        </div>
      </div>
    </div>
  </div>
</template>
