import { form, getRequestEvent } from "$app/server";
import { z } from "zod";
import { optional } from "$lib/remote/schemas";
import { APPWRITE } from "$lib/appwrite/config";
import { ID } from "appwrite";

export const add = form(z.object({
  name: z.string(),
  email: optional(z.email()),
  phone: optional(z.string()),
  admin: z.coerce.boolean<boolean>()
}), async data => {
  const { locals, params } = getRequestEvent()

  await locals.db.createRow({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.CONTACT_PERSONS,
    rowId: ID.unique(),
    data: {
      customer: params.id,
      name: data.name,
      isAdmin: data.admin,
      email: data.email,
      phone: data.phone
    }
  })

  return { message: "Contactpersoon aangemaakt" }
})

export const edit = form(z.object({
  id: z.string(),
  name: z.string(),
  email: optional(z.email()),
  phone: optional(z.string()),
  admin: z.coerce.boolean<boolean>()
}), async data => {
  const { locals } = getRequestEvent()

  await locals.db.updateRow({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.CONTACT_PERSONS,
    rowId: data.id,
    data: {
      name: data.name,
      isAdmin: data.admin,
      email: data.email ?? null,
      phone: data.phone ?? null
    }
  })

  return { message: "Contactpersoon aangepast" }
})

export const remove = form(z.object({
  id: z.string()
}), async data => {
  const { locals } = getRequestEvent()

  await locals.db.deleteRow({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.CONTACT_PERSONS,
    rowId: data.id
  })

  return { message: "Contactpersoon verwijderd" }
})