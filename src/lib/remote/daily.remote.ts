import { getRequestEvent, query } from "$app/server";
import { type Models, Query } from "appwrite";
import type { Daily } from "$lib/appwrite/types";

export const list = query(async () => {
  const { locals } = getRequestEvent()

  const result = await locals.db.listRows<Daily & Models.Row>({
    databaseId: "rolinadmin",
    tableId: "daily",
    queries: [Query.limit(1000)]
  })

  return result.rows
})