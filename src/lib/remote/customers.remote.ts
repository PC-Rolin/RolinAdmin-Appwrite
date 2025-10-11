import { getRequestEvent, query } from "$app/server";
import { z } from "zod";
import { type Models, Query } from "appwrite";
import { error } from "@sveltejs/kit";
import type { ContactPerson, Customer, System } from "$lib/appwrite/types";
import { APPWRITE } from "$lib/appwrite/config";

export const list = query(z.object({
  page: z.int().optional(),
  search: z.string().optional(),
  autoIncasso: z.boolean().nullish(),
  interval: z.enum(["Maand", "Kwartaal", "Jaar"]).nullish()
}), async data => {
  const { locals } = getRequestEvent()

  const queries: string[] = [
    Query.limit(50),
    Query.offset(data.page ? (data.page - 1) * 50 : 0)
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