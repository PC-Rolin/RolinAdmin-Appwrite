import { form, getRequestEvent, query } from "$app/server";
import { z } from "zod";
import { APPWRITE } from "$lib/appwrite/config";
import { ID, type Models, Query } from "appwrite";
import type { PricelistCategory, PricelistPrice } from "$lib/appwrite/types";

export const createCategory = form(z.object({
  name: z.string()
}), async data => {
  const { locals } = getRequestEvent()

  await locals.db.createRow({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.PRICELIST_CATEGORIES,
    rowId: ID.unique(),
    data: {
      name: data.name
    }
  })

  return { message: "Categorie aangemaakt" }
})

export const listCategories = query(async () => {
  const { locals } = getRequestEvent()

  const { rows } = await locals.db.listRows<PricelistCategory & { prices: PricelistPrice[] } & Models.Row>({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.PRICELIST_CATEGORIES,
    queries: [Query.limit(1000)]
  })

  return rows
})

export const editCategory = form(z.object({
  id: z.string(),
  name: z.string()
}), async data => {
  const { locals } = getRequestEvent()

  await locals.db.updateRow({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.PRICELIST_CATEGORIES,
    rowId: data.id,
    data: {
      name: data.name
    }
  })

  await listCategories().refresh()

  return { message: "Categorie aangepast" }
})