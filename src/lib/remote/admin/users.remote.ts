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
  id: z.string()
}), async data => {
  const { users } = createAdminClient()

  await users.delete({ userId: data.id })

  return { message: "Gebruiker verwijderd" }
})

export const promote = form(z.object({
  id: z.string()
}), async data => {
  const { users } = createAdminClient()

  await users.updateLabels({
    userId: data.id,
    labels: ["admin"]
  })

  return { message: "Gebruiker gepromoveerd" }
})

export const demote = form(z.object({
  id: z.string()
}), async data => {
  const { users } = createAdminClient()

  await users.updateLabels({
    userId: data.id,
    labels: []
  })

  return { message: "Gebruiker gedegradeerd" }
})