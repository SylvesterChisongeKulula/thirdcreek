import type { StoreLocation } from './crm-contacts'

export interface StaffMember {
  name: string
  role: string
  location: StoreLocation
}

export const staff: StaffMember[] = [
  { name: 'Nalwamba Kabungo', role: 'Company Director', location: 'Kabwata' },
  { name: 'Ruth Mulungushi', role: 'Company Director', location: 'Chalala' },
  { name: 'Peter Mulunda', role: 'Accountant', location: 'Kabwata' },
  { name: 'Mwansa Banda', role: 'Sales Executive', location: 'Kabwata' },
  { name: 'Chileshe Phiri', role: 'Sales Executive', location: 'Chalala' },
  { name: 'Bwalya Mumba', role: 'Parts Advisor', location: 'Ibex Hill (Meanwood)' },
  { name: 'Kondwani Mwale', role: 'Workshop Technician', location: 'Kabwata' },
  { name: 'Natasha Zulu', role: 'Customer Service', location: 'Chalala' },
]
