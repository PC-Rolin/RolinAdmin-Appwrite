import { getRequestEvent, query } from "$app/server";
import { z } from "zod";
import { type Models, Query } from "appwrite";
import { error } from "@sveltejs/kit";
import type { Customer } from "$lib/appwrite/types";

export const list = query(async () => {
  const { locals } = getRequestEvent()

  return locals.db.listRows<Customer & Models.Row>({
    databaseId: "rolinadmin",
    tableId: "customers"
  })
})

export const get = query(z.string(), async id => {
  const { locals } = getRequestEvent()

  return locals.db.getRow<Customer & Models.Row>({
    databaseId: "rolinadmin",
    tableId: "customers",
    rowId: id
  })
})

export const getByWTicket = query(z.number(), async id => {
  const { locals } = getRequestEvent()

  const result = await locals.db.listRows({
    databaseId: "rolinadmin",
    tableId: "customers",
    queries: [Query.equal("wticket", id)]
  })

  return result.rows.length > 0 ? result.rows[0] : error(404, "Customer not found")
})