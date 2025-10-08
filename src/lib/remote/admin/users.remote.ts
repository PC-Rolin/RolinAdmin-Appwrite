import { getRequestEvent, query } from "$app/server";
import { createAdminClient } from "$lib/server/appwrite";

export const list = query(async () => {
  const event = getRequestEvent()
  console.log(event)
  const { users } = createAdminClient()

  return users.list<Preferences>()
})