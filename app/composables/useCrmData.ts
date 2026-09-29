import type { Contact } from '~/data/crm-contacts'
import type { Lead, LeadStage } from '~/data/crm-leads'

export function useCrmData() {
  const requestFetch = useRequestFetch()
  const contactsFetch = useFetch<Contact[]>('/api/admin/contacts', { default: () => [], $fetch: requestFetch })
  const leadsFetch = useFetch<Lead[]>('/api/admin/leads', { default: () => [], $fetch: requestFetch })

  const contactsState = computed(() => contactsFetch.data.value ?? [])
  const leadsState = computed(() => leadsFetch.data.value ?? [])

  async function refreshAll() {
    await Promise.all([contactsFetch.refresh(), leadsFetch.refresh()])
  }

  function getContact(id: string) {
    return contactsState.value.find((contact) => contact.id === id)
  }

  async function addContact(input: Omit<Contact, 'id' | 'createdAt' | 'notes' | 'purchaseHistory'>): Promise<Contact> {
    const contact = await $fetch<Contact>('/api/admin/contacts', { method: 'POST', body: input })
    await contactsFetch.refresh()
    return contact
  }

  async function addLead(input: Omit<Lead, 'id' | 'stage' | 'createdAt' | 'lastUpdated'>): Promise<Lead> {
    const lead = await $fetch<Lead>('/api/admin/leads', { method: 'POST', body: input })
    await leadsFetch.refresh()
    return lead
  }

  async function advanceLeadStage(leadId: string, newStage: LeadStage) {
    try {
      await $fetch(`/api/admin/leads/${leadId}/stage`, { method: 'PATCH', body: { stage: newStage } })
      await refreshAll()
    } catch (error) {
      console.error('Failed to advance lead stage', error)
    }
  }

  async function markLeadLost(leadId: string) {
    await advanceLeadStage(leadId, 'Lost')
  }

  async function convertLeadToContact(
    leadId: string,
    input: Omit<Contact, 'id' | 'createdAt' | 'notes' | 'purchaseHistory'>,
  ): Promise<Contact> {
    const contact = await $fetch<Contact>(`/api/admin/leads/${leadId}/convert`, { method: 'POST', body: input })
    await refreshAll()
    return contact
  }

  return {
    contactsState,
    leadsState,
    getContact,
    addContact,
    addLead,
    advanceLeadStage,
    markLeadLost,
    convertLeadToContact,
  }
}
