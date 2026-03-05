export interface MenuPricing {
  size: string
  price: number
}

export interface MenuItem {
  name: string
  category: string
  pricing: MenuPricing[]
}

export const MENU_ITEMS: MenuItem[] = [
  { name: '1 Rice',                            category: 'Misc',    pricing: [{ size: 'Regular', price: 15 }] },
  { name: '1/2 Rice',                          category: 'Misc',    pricing: [{ size: 'Regular', price: 8  }] },
  { name: '1 1/2 Rice',                        category: 'Misc',    pricing: [{ size: 'Regular', price: 23 }] },
  { name: 'Inihaw Liempo',                     category: 'Pork',    pricing: [{ size: 'Regular', price: 80 }] },
  { name: 'Crispy Pork Kare-Kare',             category: 'Pork',    pricing: [{ size: 'Regular', price: 75 }] },
  { name: 'Pusit with Sotanghon',              category: 'Fish',    pricing: [{ size: 'Regular', price: 75 }] },
  { name: 'Beef Stew',                         category: 'Beef',    pricing: [{ size: 'Regular', price: 75 }] },
  { name: 'Pork Dinuguan',                     category: 'Pork',    pricing: [{ size: 'Regular', price: 65 }] },
  { name: 'Chicken Caldereta',                 category: 'Chicken', pricing: [{ size: 'Regular', price: 65 }] },
  { name: 'Sitcharo with Cauli and Sotanghon', category: 'Veg',     pricing: [{ size: 'Regular', price: 45 }] },
  { name: 'Daing Galunggong',                  category: 'Veg',     pricing: [{ size: 'Regular', price: 40 }] },
  { name: 'Munggo',                            category: 'Veg',     pricing: [{ size: 'Regular', price: 40 }] },
]

export const CATEGORIES = ['All', ...Array.from(new Set(MENU_ITEMS.map(i => i.category)))]

// Category colour pill styles
export const CATEGORY_COLORS: Record<string, string> = {
  Misc:    'bg-slate-100 text-slate-600',
  Pork:    'bg-rose-100  text-rose-700',
  Fish:    'bg-blue-100  text-blue-700',
  Beef:    'bg-amber-100 text-amber-700',
  Chicken: 'bg-yellow-100 text-yellow-700',
  Veg:     'bg-green-100 text-green-700',
}