import type { LayoutLoad } from './$types'
import { createClient } from "$lib/appwrite";
import { Avatars } from "appwrite";

export const load: LayoutLoad = async ({ data }) => {
  const client = createClient(data.session)

  return {
    aw: {
      client,
      avatars: new Avatars(client)
    }
  }
}