type AppwriteConfig = {
  DB: string
} & Record<string, string>

export const APPWRITE = {
  DB: "rolinadmin",
  CUSTOMERS: "customers",
  DAILY: "daily",
  PRICELIST_PRICES: "pricelistPrices",
  PRICELIST_CATEGORIES: "pricelistCategories",
  CONTACT_PERSONS: "contactPersons",
  SYSTEMS: "systems",
  OVERSTAPS: "overstaps"
} as const satisfies AppwriteConfig