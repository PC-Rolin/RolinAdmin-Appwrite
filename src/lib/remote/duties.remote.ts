import { command, getRequestEvent, query } from "$app/server";
import { APPWRITE } from "$lib/appwrite/config";
import type { Duty } from "$lib/appwrite/types";
import type { Models } from "appwrite";
import { z } from "zod";

export const list = query(async () => {
  const { locals } = getRequestEvent()

  const result = await locals.db.listRows<Duty & Models.Row>({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.DUTIES
  })

  return result.rows
})

export const updateAgent = command(z.object({
  id: z.string(),
  agent: z.string().length(20)
}), async data => {
  const { locals } = getRequestEvent()

  await locals.db.updateRow<Duty & Models.Row>({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.DUTIES,
    rowId: data.id,
    data: {
      agent: data.agent
    }
  })
})

export const updateName = command(z.object({
  id: z.string(),
  name: z.string()
}), async data => {
  const { locals } = getRequestEvent()

  await locals.db.updateRow<Duty & Models.Row>({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.DUTIES,
    rowId: data.id,
    data: {
      name: data.name
    }
  })
})