export type Daily = {
  ticket: number
  agent: string | null
  completedBy: string | null
  prio: number | null
  status: string | null
}

export type Customer = {
  wticket: number
  name: string
  type: "Particulier" | "Zakelijk"
  street: string | null
  houseNumber: string | null
  ninjaOrganization: number | null
  snelstartId: number | null
  postalCode: string | null
  invoiceEmail: string | null
  wantsInvoice: boolean | null
  invoiceInterval: "Maand" | "Kwartaal" | "Jaar" | null
  invoiceIncasso: boolean | null
  city: string | null
  notes: string | null
  hasOffice: boolean | null
}

export type ContactPerson = {
  name: string
  isAdmin: boolean
  email: string | null
  phone: string | null
}

export type System = {
  ninja: number
  package: number
  hasSyncback: boolean | null
  contactPerson: string | null
}