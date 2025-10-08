import { query } from "$app/server";
import { z } from "zod";
import { createAdminClient } from "$lib/server/appwrite";

export const get = query(z.string(), async id => {
  const { users } = createAdminClient()

  const user = await users.get<Preferences>({ userId: id })

  return {
    $id: user.$id,
    name: user.name,
    email: user.email
  }
})

export const list = query(async () => {
  const { users } = createAdminClient()

  const result = await users.list<Preferences>()

  return result.users.map(user => ({
    $id: user.$id,
    name: user.name,
    email: user.email
  }))
})