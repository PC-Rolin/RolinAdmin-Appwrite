import type { LayoutLoad } from "./$types";
import * as users from "$lib/remote/admin/users.remote"

export const load: LayoutLoad = async ({ parent }) => {
  const { breadcrumbs } = await parent()

  return {
    breadcrumbs: breadcrumbs.concat({ href: "/app/admin/users", label: "Gebruikers" }),
    users: await users.list()
  }
}