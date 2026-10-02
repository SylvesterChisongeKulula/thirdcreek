export interface CoreValue {
  title: string
  description: string
}

export const coreValues: CoreValue[] = [
  { title: 'Excellence', description: 'We strive for excellence in everything we do.' },
  {
    title: 'Accountability',
    description: 'We take responsibility for our actions and are committed to delivering on our promises.',
  },
  {
    title: 'Teamwork',
    description: 'We believe in the power of collaboration and working together to achieve common goals.',
  },
  {
    title: 'Efficiency',
    description: 'We optimize our processes to ensure timely delivery and cost effectiveness without compromising quality.',
  },
  {
    title: 'Integrity',
    description: 'We conduct our business with honesty, transparency, and respect for all stakeholders.',
  },
  {
    title: 'Respect',
    description: 'We treat everyone with dignity and respect, fostering a positive work environment.',
  },
  {
    title: 'Tolerance',
    description: 'We embrace diversity and promote an inclusive culture where different perspectives are valued and respected.',
  },
]

export const whyChooseUs: string[] = [
  'We are reliable',
  'We are committed',
  'We are consistent',
  'We are time responsive',
  'We value each and every customer',
]

export interface SupplierCountry {
  name: string
  flag: string
}

export const supplierCountries: SupplierCountry[] = [
  { name: 'China', flag: '🇨🇳' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'Dubai', flag: '🇦🇪' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Germany', flag: '🇩🇪' },
]

export interface TeamMember {
  name: string
  role: string
  initials: string
  image: string
}

export const team: TeamMember[] = [
  {
    name: 'Nede Nalwamba Kabungo',
    role: 'Company Director',
    initials: 'NK',
    image: '/images/profile/exec-kabungo.jpg',
  },
  {
    name: 'Ruth Mulungushi',
    role: 'Company Director',
    initials: 'RM',
    image: '/images/profile/exec-mulungushi.jpg',
  },
  {
    name: 'Peter Mulunda',
    role: 'Company Accountant',
    initials: 'PM',
    image: '/images/profile/exec-mulunda.jpg',
  },
]

export const aboutHeroImage = '/images/profile/team-group.jpg'
export const staffPortraitImage = '/images/profile/staff-portrait.jpg'
export const teamGalleryImages: string[] = [
  '/images/profile/team-full-1.jpg',
  '/images/profile/team-full-2.jpg',
  '/images/profile/team-full-3.jpg',
  '/images/profile/team-full-4.jpg',
]

export interface BranchMap {
  // An address or "lat,lng" pair, as typed into Google Maps search.
  query: string
  zoom: number
  // True while we only know the area, not the exact pin.
  approximate?: boolean
}

export interface BranchLocation {
  name: string
  address: string
  main?: boolean
  map: BranchMap
}

// Keyless Google Maps embed, suitable for an <iframe>.
export function mapEmbedUrl(map: BranchMap) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(map.query)}&z=${map.zoom}&hl=en&output=embed`
}

// Opens the place in Google Maps (or the Maps app on a phone) for directions.
export function mapDirectionsUrl(map: BranchMap) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(map.query)}`
}

export const contact = {
  phonePrimary: '0770598983',
  phonePrimaryIntl: '260770598983',
  phoneSecondary: '0966190060',
  email: 'thirdcreek1996@gmail.com',
  locations: [
    {
      name: 'Ibex Hill (Meanwood)',
      address: '1749 Serval, Meanwood, Ibex Hill, Lusaka',
      main: true,
      map: { query: '1749 Serval, Meanwood, Ibex Hill, Lusaka', zoom: 16 },
    },
    {
      name: 'Chalala',
      address: 'Chalala, Lusaka',
      map: { query: '-15.4613826,28.3289765', zoom: 17 },
    },
    {
      name: 'Kabwata',
      address: 'Kabwata, Lusaka',
      // TODO: replace with the branch's exact coordinates (e.g. '-15.44,28.29') and drop `approximate`.
      map: { query: 'Kabwata, Lusaka', zoom: 15, approximate: true },
    },
  ] as BranchLocation[],
}

export const missionStatement =
  'To offer our clients a comprehensive choice of genuine automobile spare parts and accessories at the best possible price; with proficient support services, in order to contribute to having safe and highly performing vehicles.'

export const visionStatement =
  'To become a leading supplier in Zambia for select automotive parts at competitive prices where customer expectations are surpassed.'
