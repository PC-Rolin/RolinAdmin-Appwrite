import type { LayoutLoad } from './$types'
import { createClient } from "$lib/appwrite";
import { Account, Avatars, TablesDB } from "appwrite";
import type { Breadcrumb } from "$lib/types";
import { Realtime } from "$lib/appwrite/realtime";

export const load: LayoutLoad = async ({ data }) => {
  const client = createClient(data.session)

  return {
    user: data.user,
    avatar: data.avatar,
    aw: {
      client,
      avatars: new Avatars(client),
      db: new TablesDB(client),
      account: new Account(client)
    },
    breadcrumbs: [] as Breadcrumb[],
    realtime: new Realtime(client)
  }
}