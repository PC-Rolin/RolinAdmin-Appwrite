import { getRequestEvent, query } from "$app/server";
import { z } from "zod";
import { type Models, Query } from "appwrite";
import { error } from "@sveltejs/kit";
import type { ContactPerson } from "$lib/appwrite/types";

export const list = query(async () => {
  const { locals } = getRequestEvent()

  return locals.appwrite.db.listRows("rolinadmin", "customers")
})

export const get = query(z.string(), async id => {
  const { locals } = getRequestEvent()

  const row = await locals.appwrite.db.getRow("rolinadmin","customers", id, [
    Query.select(["*", "contactPersons.*", "systems.*"])
  ])

  return row as typeof row & {
    contactPersons: ContactPerson[]
    systems: (Databases["rolinadmin"]["systems"] & Models.Row)[]
  }
})

export const getByWTicket = query(z.number(), async id => {
  const { locals } = getRequestEvent()

  const result = await locals.appwrite.db.listRows("rolinadmin","customers", [
    Query.equal("wticket", id)
  ])

  return result.rows.length > 0 ? result.rows[0] : error(404, "Customer not found")
})