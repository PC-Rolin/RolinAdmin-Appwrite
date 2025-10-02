import type { LayoutLoad } from './$types'
import { createClient } from "$lib/appwrite";

export const load: LayoutLoad = async ({ data }) => {
  const client = createClient(data.session)

  return {
    aw: {
      client
    }
  }
}