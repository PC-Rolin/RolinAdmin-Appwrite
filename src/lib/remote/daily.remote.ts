import { getRequestEvent, query } from "$app/server";
import { type Models, Query } from "appwrite";

export const list = query(async () => {
  const { locals } = getRequestEvent()

  const result = await locals.db.listRows<{
    ticket: number
    agent: string | null
    completedBy: string | null
    prio: number | null
    status: string | null
  } & Models.Row>({
    databaseId: "rolinadmin",
    tableId: "daily",
    queries: [Query.limit(1000)]
  })

  return result.rows
})