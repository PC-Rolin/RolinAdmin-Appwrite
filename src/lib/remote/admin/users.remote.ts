import { query } from "$app/server";
import { createAdminClient } from "$lib/server/appwrite";

export const list = query(async () => {
  const { users } = createAdminClient()

  return users.list<Preferences>()
})