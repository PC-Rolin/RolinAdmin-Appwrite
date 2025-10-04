import { command, getRequestEvent, query } from "$app/server";
import { type Models, Query } from "appwrite";
import type { Daily } from "$lib/appwrite/types";
import { z } from "zod";
import { error } from "@sveltejs/kit";

export const list = query(async () => {
  const { locals } = getRequestEvent()

  const result = await locals.db.listRows<Daily & Models.Row>({
    databaseId: "rolinadmin",
    tableId: "daily",
    queries: [Query.limit(1000)]
  })

  return result.rows
})

export const update = command(z.object({
  $id: z.string(),
  ticket: z.number(),
  agent: z.string().nullable(),
  prio: z.number().min(1).max(3).nullable(),
  status: z.string().nullable(),
  completedBy: z.string().nullable(),
}), async data => {
  const { locals } = getRequestEvent()

  await locals.db.updateRow<Daily & Models.Row>({
    databaseId: "rolinadmin",
    tableId: "daily",
    rowId: data.$id,
    data: data
  })
})

export const markAsCompleted = command(z.object({
  id: z.string(),
  agent: z.string().optional()
}), async data => {
  const { locals } = getRequestEvent()

  const completedBy = data.agent ?? locals.user?.$id
  if (!completedBy) error(400, "You must be logged in to mark a daily as completed")

  await locals.db.updateRow<Daily & Models.Row>({
    databaseId: "rolinadmin",
    tableId: "daily",
    rowId: data.id,
    data: {
      completedBy
    }
  })
})

export const unmarkAsCompleted = command(z.string(), async id => {
  const { locals } = getRequestEvent()

  await locals.db.updateRow<Daily & Models.Row>({
    databaseId: "rolinadmin",
    tableId: "daily",
    rowId: id,
    data: {
      completedBy: null
    }
  })
})

export const remove = command(z.string(), async id => {
  const { locals } = getRequestEvent()

  await locals.db.deleteRow({
    databaseId: "rolinadmin",
    tableId: "daily",
    rowId: id
  })
})