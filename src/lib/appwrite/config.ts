type AppwriteConfig = {
  DB: string
} & Record<string, string>

export const APPWRITE = {
  DB: "rolinadmin",
  CUSTOMERS: "customers",
  DAILY: "daily",
  PRICELIST_PRICES: "pricelistPrices",
  PRICELIST_CATEGORIES: "pricelistCategories"
} as const satisfies AppwriteConfig