export type Brand = 'Land Rover' | 'Range Rover' | 'Toyota' | 'Mercedes-Benz' | 'BMW'

export type Category =
  | 'Brakes'
  | 'Suspension'
  | 'Steering'
  | 'Engine'
  | 'Belts & Filters'
  | 'Oils & Fluids'

export interface Product {
  id: string
  name: string
  brand: Brand
  category: Category
  blurb: string
  image: string
}

export const products: Product[] = [
  {
    id: 'brake-discs-pads',
    name: 'Brake Discs & Brake Pads',
    brand: 'Land Rover',
    category: 'Brakes',
    blurb: 'Genuine front and rear disc and pad sets for reliable, confident stopping power.',
    image: '/images/profile/product-brake-discs.jpg',
  },
  {
    id: 'shock-absorbers',
    name: 'Shock Absorbers',
    brand: 'Range Rover',
    category: 'Suspension',
    blurb: 'Heavy-duty shock absorbers built for Zambian roads and long-term ride comfort.',
    image: '/images/profile/product-shock-absorbers.jpg',
  },
  {
    id: 'tie-rod-ends',
    name: 'Tie Rod Ends',
    brand: 'Mercedes-Benz',
    category: 'Steering',
    blurb: 'Precision steering components to keep alignment tight and handling predictable.',
    image: '/images/profile/product-tie-rod-ends.jpg',
  },
  {
    id: 'rack-ends',
    name: 'Rack Ends',
    brand: 'BMW',
    category: 'Steering',
    blurb: 'Durable rack end links sourced from trusted suppliers for a smooth steering feel.',
    image: '/images/profile/product-rack-ends.jpg',
  },
  {
    id: 'timing-belts',
    name: 'Timing & Drive Belts',
    brand: 'Toyota',
    category: 'Belts & Filters',
    blurb: 'Genuine timing and drive belt kits to keep your engine running in sync.',
    image: '/images/profile/product-belts.jpg',
  },
  {
    id: 'spark-plugs',
    name: 'Spark Plugs',
    brand: 'Toyota',
    category: 'Engine',
    blurb: 'Reliable ignition for smoother starts, better fuel economy and engine performance.',
    image: '/images/profile/product-spark-plugs.jpg',
  },
  {
    id: 'air-filters',
    name: 'Air Filters',
    brand: 'BMW',
    category: 'Belts & Filters',
    blurb: 'Clean air intake filters that protect your engine and keep it breathing easy.',
    image: '/images/profile/product-air-filters.jpg',
  },
  {
    id: 'castrol-magnatec',
    name: 'Castrol Magnatec 5W-30',
    brand: 'Land Rover',
    category: 'Oils & Fluids',
    blurb: 'Synthetic technology engine oil that protects from the moment of start-up.',
    image: '/images/profile/oil-castrol-magnatec.jpg',
  },
  {
    id: 'castrol-edge-turbo-diesel',
    name: 'Castrol Edge Turbo Diesel 5W-40',
    brand: 'Range Rover',
    category: 'Oils & Fluids',
    blurb: 'High-performance diesel engine oil unlocking the edge of engine performance.',
    image: '/images/profile/oil-castrol-edge-turbo.jpg',
  },
  {
    id: 'shell-helix-diesel',
    name: 'Shell Helix Diesel HX5 5W-40',
    brand: 'Mercedes-Benz',
    category: 'Oils & Fluids',
    blurb: 'Trusted diesel engine protection for petrol and diesel engines alike.',
    image: '/images/profile/oil-shell-helix.jpg',
  },
]

export const brands: Brand[] = ['Land Rover', 'Range Rover', 'Toyota', 'Mercedes-Benz', 'BMW']

export const categories: Category[] = [
  'Brakes',
  'Suspension',
  'Steering',
  'Engine',
  'Belts & Filters',
  'Oils & Fluids',
]
