import { command, getRequestEvent, query } from "$app/server";
import { Query } from "appwrite";
import { z } from "zod";
import { error } from "@sveltejs/kit";

export const list = query(async () => {
  const { locals } = getRequestEvent()

  const result = await locals.appwrite.db.listRows("rolinadmin", "daily", [Query.limit(1000)])

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

  await locals.appwrite.db.updateRow("rolinadmin","daily", data.$id, data)
})

export const markAsCompleted = command(z.object({
  id: z.string(),
  agent: z.string().optional()
}), async data => {
  const { locals } = getRequestEvent()

  const completedBy = data.agent ?? locals.user?.$id
  if (!completedBy) error(400, "You must be logged in to mark a daily as completed")

  await locals.appwrite.db.updateRow("rolinadmin","daily", data.id, {
    completedBy
  })
})

export const unmarkAsCompleted = command(z.string(), async id => {
  const { locals } = getRequestEvent()

  await locals.appwrite.db.updateRow("rolinadmin", "daily", id, {
    completedBy: null
  })
})

export const remove = command(z.string(), async id => {
  const { locals } = getRequestEvent()

  await locals.appwrite.db.deleteRow("rolinadmin","daily", id)
})