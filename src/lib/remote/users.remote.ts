import { query } from "$app/server";
import { z } from "zod";
import { createAdminClient } from "$lib/server/appwrite";

export const get = query(z.string(), id => {
  const { users } = createAdminClient()

  return users.get<Preferences>({
    userId: id
  })
})