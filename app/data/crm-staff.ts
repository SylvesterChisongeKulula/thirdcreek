import type { StoreLocation } from './crm-contacts'

export interface StaffMember {
  name: string
  role: string
  location: StoreLocation
}

// A staff member as returned by the admin API (never includes the password hash).
export interface StaffAccount extends StaffMember {
  id: number
  authRole: 'owner' | 'staff'
  hasLogin: boolean
}

export type StaffAccountInput = Pick<StaffAccount, 'role' | 'location' | 'authRole'>

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
