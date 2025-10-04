import type { LayoutLoad } from './$types'
import { createClient } from "$lib/appwrite";
import { Avatars } from "appwrite";
import type { Breadcrumb } from "$lib/types";
import { Realtime } from "$lib/appwrite/realtime";

export const load: LayoutLoad = async ({ data }) => {
  const client = createClient(data.session)

  return {
    user: data.user,
    aw: {
      client,
      avatars: new Avatars(client)
    },
    breadcrumbs: [] as Breadcrumb[],
    realtime: new Realtime(client)
  }
}