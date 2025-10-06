import type { LayoutLoad } from './$types'
import type { Breadcrumb } from "$lib/types";
import { Realtime } from "$lib/appwrite/realtime";
import { SharedClient } from "appwrite-sveltekit";
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT } from "$env/static/public";

export const load: LayoutLoad = async ({ data }) => {
  const appwrite = new SharedClient(PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT, {
    cookies: {
      get() {
        return data.session
      }
    }
  })

  return {
    user: data.user,
    aw: appwrite,
    breadcrumbs: [] as Breadcrumb[],
    realtime: new Realtime(appwrite.client)
  }
}