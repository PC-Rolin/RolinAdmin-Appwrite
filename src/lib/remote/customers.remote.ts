import { form, getRequestEvent, query } from "$app/server";
import { z } from "zod";
import { ID, type Models, Query } from "appwrite";
import { error, redirect } from "@sveltejs/kit";
import type { ContactPerson, Customer, System } from "$lib/appwrite/types";
import { APPWRITE } from "$lib/appwrite/config";
import { optional } from "$lib/remote/schemas";

export const list = query(z.object({
  page: z.int().optional(),
  search: z.string().optional(),
  autoIncasso: z.boolean().nullish(),
  interval: z.enum(["Maand", "Kwartaal", "Jaar"]).nullish()
}), async data => {
  const { locals } = getRequestEvent()

  const queries: string[] = [
    Query.limit(50),
    Query.offset(data.page ? (data.page - 1) * 50 : 0),
    Query.orderAsc("wticket")
  ]

  if (data.search && data.search.length > 0) {
    const orQueries: string[] = [
      Query.search("name", data.search)
    ]
    if (Number.isInteger(Number(data.search))) {
      orQueries.push(Query.equal("wticket", Number(data.search)))
      orQueries.push(Query.equal("snelstartId", Number(data.search)))
      orQueries.push(Query.equal("ninjaOrganization", Number(data.search)))
    }
    queries.push(orQueries.length > 1 ? Query.or(orQueries) : orQueries[0])
  }

  if (data.autoIncasso !== undefined && data.autoIncasso !== null) {
    queries.push(Query.equal("invoiceIncasso", data.autoIncasso))
  }
  if (data.interval !== undefined && data.interval !== null) {
    queries.push(Query.equal("invoiceInterval", data.interval))
  }

  return locals.db.listRows<Customer & Models.Row>({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.CUSTOMERS,
    queries
  })
})

export const get = query(z.string(), async id => {
  const { locals } = getRequestEvent()

  return locals.db.getRow<Customer & {
    contactPersons: (ContactPerson & Models.Row)[]
    systems: (System & Models.Row)[]
  } & Models.Row>({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.CUSTOMERS,
    rowId: id,
    queries: [
      Query.select(["*", "contactPersons.*", "systems.*"])
    ]
  })
})

export const getByWTicket = query(z.number(), async id => {
  const { locals } = getRequestEvent()

  const result = await locals.db.listRows<Customer & Models.Row>({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.CUSTOMERS,
    queries: [Query.equal("wticket", id)]
  })

  return result.rows.length > 0 ? result.rows[0] : error(404, "Customer not found")
})

export const add = form(z.object({
  name: z.string(),
  wticket: z.coerce.number<string>().min(10000),
  type: z.enum(["Particulier", "Zakelijk"])
}), async data => {
  const { locals } = getRequestEvent()

  await locals.db.createRow({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.CUSTOMERS,
    rowId: ID.unique(),
    data: {
      name: data.name,
      wticket: data.wticket,
      type: data.type
    }
  })

  return { message: "Klant aangemaakt" }
})

export const updateInformation = form(z.object({
  name: z.string(),
  type: z.enum(["Particulier", "Zakelijk"]),
  notes: optional(z.string())
}), async data => {
  const { locals, params } = getRequestEvent()

  if (!params.id) error(400)

  await locals.db.updateRow({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.CUSTOMERS,
    rowId: params.id,
    data: {
      name: data.name,
      type: data.type,
      notes: data.notes ?? null
    }
  })

  return { message: "Klantinformatie aangepast" }
})

export const updateAddress = form(z.object({
  street: optional(z.string()),
  houseNumber: optional(z.string()),
  postalCode: optional(z.string()),
  city: optional(z.string())
}), async data => {
  const { locals, params } = getRequestEvent()

  if (!params.id) error(400)

  await locals.db.updateRow({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.CUSTOMERS,
    rowId: params.id,
    data: {
      street: data.street ?? null,
      houseNumber: data.houseNumber ?? null,
      postalCode: data.postalCode ?? null,
      city: data.city ?? null
    }
  })

  return { message: "Adres aangepast" }
})

export const updateSubscriptions = form(z.object({
  hasOffice: z.coerce.boolean<boolean>()
}), async data => {
  const { locals, params } = getRequestEvent()

  if (!params.id) error(400)

  await locals.db.updateRow({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.CUSTOMERS,
    rowId: params.id,
    data: {
      hasOffice: data.hasOffice
    }
  })

  return { message: "Abonnementen aangepast" }
})

export const updateConnections = form(z.object({
  wticket: z.coerce.number<string>().min(10000),
  snelstartId: optional(z.coerce.number()),
  ninjaOrganization: optional(z.coerce.number())
}), async data => {
  const { locals, params } = getRequestEvent()

  if (!params.id) error(400)

  await locals.db.updateRow({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.CUSTOMERS,
    rowId: params.id,
    data: {
      wticket: data.wticket,
      snelstartId: data.snelstartId ?? null,
      ninjaOrganization: data.ninjaOrganization ?? null
    }
  })

  return { message: "Koppelingen aangepast" }
})

export const updateInvoicing = form(z.object({
  wantsInvoice: z.coerce.boolean<boolean>(),
  invoiceEmail: optional(z.email()),
  invoiceInterval: optional(z.enum(["Maand", "Kwartaal", "Jaar"])),
  invoiceIncasso: z.coerce.boolean<boolean>()
}), async data => {
  const { locals, params } = getRequestEvent()

  if (!params.id) error(400)

  await locals.db.updateRow({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.CUSTOMERS,
    rowId: params.id,
    data: {
      wantsInvoice: data.wantsInvoice,
      invoiceEmail: data.invoiceEmail ?? null,
      invoiceInterval: data.invoiceInterval ?? null,
      invoiceIncasso: data.invoiceIncasso
    }
  })

  return { message: "Facturatie aangepast" }
})

export const remove = form(async () => {
  const { locals, params } = getRequestEvent()

  if (!params.id) error(400)

  await locals.db.deleteRow({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.CUSTOMERS,
    rowId: params.id
  })

  redirect(302, "/app/klanten")
})