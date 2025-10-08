import { getRequestEvent, query } from "$app/server";
import { z } from "zod";
import { type Models, Query } from "appwrite";
import { error } from "@sveltejs/kit";
import type { ContactPerson, Customer, System } from "$lib/appwrite/types";
import { APPWRITE } from "$lib/appwrite/config";

export const list = query(async () => {
  const { locals } = getRequestEvent()

  return locals.db.listRows<Customer & Models.Row>({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.CUSTOMERS
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