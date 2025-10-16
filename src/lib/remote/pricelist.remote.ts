import { form, getRequestEvent, query } from "$app/server";
import { z } from "zod";
import { APPWRITE } from "$lib/appwrite/config";
import { ID, type Models, Query } from "appwrite";
import type { PricelistCategory, PricelistPrice } from "$lib/appwrite/types";
import { optional } from "$lib/remote/schemas";

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

  const { rows } = await locals.db.listRows<PricelistCategory & { prices: (PricelistPrice & Models.Row)[] } & Models.Row>({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.PRICELIST_CATEGORIES,
    queries: [
      Query.limit(1000),
      Query.select(["*", "prices.*"])
    ]
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

export const deleteCategory = form(z.object({
  id: z.string()
}), async data => {
  const { locals } = getRequestEvent()

  await locals.db.deleteRow({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.PRICELIST_CATEGORIES,
    rowId: data.id
  })

  return { message: "Categorie verwijderd" }
})

export const createPrice = form(z.object({
  category: z.string().length(20, "Selecteer een geldige categorie"),
  name: z.string().max(1500),
  price: z.number().min(0),
  priceZakelijk: optional(z.number().min(0)),
  comment: optional(z.string().max(1500))
}), async data => {
  const { locals } = getRequestEvent()

  await locals.db.createRow({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.PRICELIST_PRICES,
    rowId: ID.unique(),
    data: {
      category: data.category,
      name: data.name,
      price: data.price,
      priceZakelijk: data.priceZakelijk ?? null,
      comment: data.comment ?? null
    }
  })

  return { message: "Prijs aangemaakt" }
})

export const updatePrice = form(z.object({
  id: z.string(),
  category: z.string().length(20, "Selecteer een geldige categorie"),
  name: z.string().max(1500),
  price: z.number().min(0),
  priceZakelijk: optional(z.number().min(0)),
  comment: optional(z.string().max(1500))
}), async data => {
  const { locals } = getRequestEvent()

  await locals.db.updateRow({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.PRICELIST_PRICES,
    rowId: data.id,
    data: {
      category: data.category,
      name: data.name,
      price: data.price,
      priceZakelijk: data.priceZakelijk ?? null,
      comment: data.comment ?? null
    }
  })

  return { message: "Prijs aangepast" }
})