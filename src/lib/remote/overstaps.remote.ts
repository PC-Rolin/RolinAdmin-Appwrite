import { command, form, getRequestEvent, query } from "$app/server";
import { ID, type Models, Query } from "appwrite";
import type { Overstap } from "$lib/appwrite/types";
import { z } from "zod";
import { error } from "@sveltejs/kit";
import { APPWRITE } from "$lib/appwrite/config";

export const list = query(async () => {
  const { locals } = getRequestEvent()

  const result = await locals.db.listRows<Overstap & Models.Row>({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.OVERSTAPS,
    queries: [Query.limit(1000)]
  })

  return result.rows
})

export const update = command(z.object({
  $id: z.string(),
  ticket: z.number(),
  agent: z.string().nullable(),
  prio: z.number().nullable(),
  status: z.enum(["Voorbereiding", "Start Kloon", "Afwerking", "Nazorg"]).nullable(),
  comment: z.string().nullable()
}), async data => {
  const { locals } = getRequestEvent()

  await locals.db.updateRow<Overstap & Models.Row>({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.OVERSTAPS,
    rowId: data.$id,
    data
  })
})

export const markAsCompleted = command(z.object({
  id: z.string(),
  agent: z.string().optional()
}), async data => {
  const { locals } = getRequestEvent()

  const completedBy = data.agent ?? locals.user?.$id
  if (!completedBy) error(400, "You must be logged in to mark a daily as completed")

  await locals.db.updateRow<Overstap & Models.Row>({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.OVERSTAPS,
    rowId: data.id,
    data: {
      completedBy
    }
  })
})

export const unmarkAsCompleted = command(z.string(), async id => {
  const { locals } = getRequestEvent()

  await locals.db.updateRow<Overstap & Models.Row>({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.OVERSTAPS,
    rowId: id,
    data: {
      completedBy: null
    }
  })
})

export const remove = command(z.string(), async id => {
  const { locals } = getRequestEvent()

  await locals.db.deleteRow({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.OVERSTAPS,
    rowId: id
  })
})

export const add = form(z.object({
  ticket: z.coerce.number<string>().min(100000)
}), async data => {
  const { locals } = getRequestEvent()

  await locals.db.createRow({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.OVERSTAPS,
    rowId: ID.unique(),
    data: {
      ticket: data.ticket
    }
  })

  return { message: "Overstap aangemaakt" }
})