import type { Brand } from './products'

export type StoreLocation = 'Kabwata' | 'Chalala' | 'Ibex Hill (Meanwood)'

export const storeLocations: StoreLocation[] = ['Kabwata', 'Chalala', 'Ibex Hill (Meanwood)']

export interface ContactNote {
  date: string
  author: string
  text: string
}

export interface PurchaseRecord {
  date: string
  item: string
  amount: number
}

export interface Contact {
  id: string
  name: string
  phone: string
  whatsapp: string
  email: string
  location: StoreLocation
  vehicleBrands: Brand[]
  tags: string[]
  createdAt: string
  notes: ContactNote[]
  purchaseHistory: PurchaseRecord[]
}

export const contacts: Contact[] = [
  {
    id: 'mwaba-chanda',
    name: 'Mwaba Chanda',
    phone: '0977123456',
    whatsapp: '260977123456',
    email: 'mwaba.chanda@example.com',
    location: 'Kabwata',
    vehicleBrands: ['Land Rover', 'Range Rover'],
    tags: ['Fleet client', 'Priority'],
    createdAt: '2025-11-04',
    notes: [
      { date: '2026-08-20', author: 'Mwansa Banda', text: 'Runs a 4-vehicle Land Rover fleet, orders brake parts quarterly.' },
      { date: '2026-06-02', author: 'Mwansa Banda', text: 'Asked about bulk pricing on oil filters.' },
    ],
    purchaseHistory: [
      { date: '2026-07-15', item: 'Brake Discs & Pads (x2 sets)', amount: 4200 },
      { date: '2026-04-02', item: 'Castrol Magnatec 5W-30 (x6)', amount: 2760 },
    ],
  },
  {
    id: 'chileshe-mubanga',
    name: 'Chileshe Mubanga',
    phone: '0966554321',
    whatsapp: '260966554321',
    email: 'chileshe.mubanga@example.com',
    location: 'Chalala',
    vehicleBrands: ['BMW'],
    tags: ['Walk-in'],
    createdAt: '2026-01-12',
    notes: [{ date: '2026-09-01', author: 'Chileshe Phiri', text: 'Interested in steering components, price-sensitive.' }],
    purchaseHistory: [{ date: '2026-02-10', item: 'Air Filters', amount: 380 }],
  },
  {
    id: 'bwalya-mutale',
    name: 'Bwalya Mutale',
    phone: '0955781234',
    whatsapp: '260955781234',
    email: 'bwalya.mutale@example.com',
    location: 'Ibex Hill (Meanwood)',
    vehicleBrands: ['Mercedes-Benz', 'Toyota'],
    tags: ['Fleet client'],
    createdAt: '2025-09-18',
    notes: [{ date: '2026-07-28', author: 'Bwalya Mumba', text: 'Owns a small taxi fleet, 3 Toyotas + 1 Mercedes.' }],
    purchaseHistory: [
      { date: '2026-08-01', item: 'Timing & Drive Belts', amount: 950 },
      { date: '2026-05-20', item: 'Shock Absorbers (pair)', amount: 3100 },
    ],
  },
  {
    id: 'natasha-mwansa',
    name: 'Natasha Mwansa',
    phone: '0977889900',
    whatsapp: '260977889900',
    email: 'natasha.mwansa@example.com',
    location: 'Kabwata',
    vehicleBrands: ['Range Rover'],
    tags: ['Referral'],
    createdAt: '2026-03-22',
    notes: [],
    purchaseHistory: [{ date: '2026-03-30', item: 'Tie Rod Ends', amount: 1450 }],
  },
  {
    id: 'kondwani-banda',
    name: 'Kondwani Banda',
    phone: '0766112233',
    whatsapp: '260766112233',
    email: 'kondwani.banda@example.com',
    location: 'Chalala',
    vehicleBrands: ['Toyota'],
    tags: ['Walk-in'],
    createdAt: '2026-05-02',
    notes: [{ date: '2026-05-05', author: 'Chileshe Phiri', text: 'First-time customer, came via Facebook page.' }],
    purchaseHistory: [{ date: '2026-05-05', item: 'Spark Plugs (set)', amount: 620 }],
  },
  {
    id: 'ruth-tembo',
    name: 'Ruth Tembo',
    phone: '0955223344',
    whatsapp: '260955223344',
    email: 'ruth.tembo@example.com',
    location: 'Ibex Hill (Meanwood)',
    vehicleBrands: ['Land Rover'],
    tags: ['Priority'],
    createdAt: '2025-12-10',
    notes: [{ date: '2026-08-12', author: 'Bwalya Mumba', text: 'Long-time client, always calls ahead before visiting.' }],
    purchaseHistory: [
      { date: '2026-08-14', item: 'Castrol Edge Turbo Diesel 5W-40 (x4)', amount: 2100 },
      { date: '2026-01-05', item: 'Brake Discs & Pads', amount: 2400 },
    ],
  },
  {
    id: 'mulenga-sikazwe',
    name: 'Mulenga Sikazwe',
    phone: '0977445566',
    whatsapp: '260977445566',
    email: 'mulenga.sikazwe@example.com',
    location: 'Kabwata',
    vehicleBrands: ['Mercedes-Benz'],
    tags: [],
    createdAt: '2026-04-14',
    notes: [],
    purchaseHistory: [],
  },
  {
    id: 'nalwamba-kunda',
    name: 'Nalwamba Kunda',
    phone: '0966778899',
    whatsapp: '260966778899',
    email: 'nalwamba.kunda@example.com',
    location: 'Chalala',
    vehicleBrands: ['BMW', 'Toyota'],
    tags: ['Fleet client', 'Priority'],
    createdAt: '2025-08-30',
    notes: [{ date: '2026-09-10', author: 'Chileshe Phiri', text: 'Manages a small courier fleet, 2 BMWs and 2 Toyotas.' }],
    purchaseHistory: [{ date: '2026-09-10', item: 'Rack Ends', amount: 1780 }],
  },
  {
    id: 'chola-phiri',
    name: 'Chola Phiri',
    phone: '0955998877',
    whatsapp: '260955998877',
    email: 'chola.phiri@example.com',
    location: 'Ibex Hill (Meanwood)',
    vehicleBrands: ['Range Rover'],
    tags: ['Referral'],
    createdAt: '2026-06-18',
    notes: [],
    purchaseHistory: [],
  },
  {
    id: 'given-lungu',
    name: 'Given Lungu',
    phone: '0766998877',
    whatsapp: '260766998877',
    email: 'given.lungu@example.com',
    location: 'Kabwata',
    vehicleBrands: ['Land Rover'],
    tags: ['Walk-in'],
    createdAt: '2026-07-01',
    notes: [{ date: '2026-07-01', author: 'Mwansa Banda', text: 'Asked about suspension work for a 2015 Discovery.' }],
    purchaseHistory: [],
  },
  {
    id: 'agatha-mwila',
    name: 'Agatha Mwila',
    phone: '0977001122',
    whatsapp: '260977001122',
    email: 'agatha.mwila@example.com',
    location: 'Chalala',
    vehicleBrands: ['Toyota', 'Mercedes-Benz'],
    tags: ['Fleet client'],
    createdAt: '2025-10-25',
    notes: [{ date: '2026-08-30', author: 'Chileshe Phiri', text: 'Runs a school transport fleet, 5 vehicles.' }],
    purchaseHistory: [
      { date: '2026-08-30', item: 'Timing & Drive Belts (x2)', amount: 1900 },
      { date: '2026-06-15', item: 'Air Filters (x3)', amount: 1050 },
    ],
  },
]
