import { getRequestEvent, query } from "$app/server";
import { z } from "zod";
import { Query } from "appwrite";
import { error } from "@sveltejs/kit";

export const getByWTicket = query(z.number(), async id => {
  const { locals } = getRequestEvent()

  const result = await locals.db.listRows({
    databaseId: "rolinadmin",
    tableId: "customers",
    queries: [Query.equal("wticket", id)]
  })

  return result.rows.length > 0 ? result.rows[0] : error(404, "Customer not found")
})