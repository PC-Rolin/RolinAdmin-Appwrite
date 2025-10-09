import { form, query } from "$app/server";
import { createAdminClient } from "$lib/server/appwrite";
import { z } from "zod";
import { ID } from "appwrite";

export const list = query(async () => {
  const { users } = createAdminClient()

  return users.list<Preferences>()
})

export const add = form(z.object({
  email: z.email(),
  name: z.string()
}), async data => {
  const { users } = createAdminClient()

  await users.create<Preferences>({
    userId: ID.unique(),
    email: data.email,
    name: data.name
  })

  await list().refresh()

  return { message: "Gebruiker aangemaakt" }
})

export const remove = form(z.object({
  $id: z.string()
}), async data => {
  const { users } = createAdminClient()
})