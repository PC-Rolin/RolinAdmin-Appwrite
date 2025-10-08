type AppwriteConfig = {
  DB: string
} & Record<string, string>

export const APPWRITE = {
  DB: "rolinadmin",
  CUSTOMERS: "customers",
  DAILY: "daily"
} as const satisfies AppwriteConfig