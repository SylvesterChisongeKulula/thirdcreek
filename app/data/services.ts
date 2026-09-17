export type ServiceIcon = 'Stethoscope' | 'Disc3' | 'Wrench' | 'Droplet' | 'PackageSearch'

export interface Service {
  id: string
  title: string
  description: string
  note?: string
  icon: ServiceIcon
}

export const services: Service[] = [
  {
    id: 'diagnostics',
    title: 'Vehicle Diagnostics',
    description:
      'Full diagnostic checks to accurately identify the part or fault behind a warning light or performance issue.',
    icon: 'Stethoscope',
  },
  {
    id: 'brake-service',
    title: 'Brake Service & Repair',
    description:
      'Disc, pad and brake system servicing carried out with genuine parts for safe, confident stopping.',
    icon: 'Disc3',
  },
  {
    id: 'suspension-work',
    title: 'Suspension & Steering',
    description:
      'Shock absorber, tie rod and rack end replacement to restore a smooth, controlled ride.',
    icon: 'Wrench',
  },
  {
    id: 'oil-service',
    title: 'Oil Change & Servicing',
    description:
      'Routine servicing using trusted oil brands, filters and lubricants matched to your vehicle.',
    icon: 'Droplet',
  },
  {
    id: 'special-orders',
    title: 'Special & Emergency Orders',
    description:
      'Can’t find a part in stock? We source it. Standard special orders are ready within 3 months, emergency orders within 7 business days.',
    note: 'Special orders: up to 3 months · Emergency orders: up to 7 business days',
    icon: 'PackageSearch',
  },
]
