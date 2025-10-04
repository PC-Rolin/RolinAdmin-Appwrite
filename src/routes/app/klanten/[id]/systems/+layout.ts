import type { LayoutLoad } from "./$types";
import * as systems from "$lib/remote/systems.remote"

export const load: LayoutLoad = async ({ params, parent }) => {
  const { breadcrumbs } = await parent()

  return {
    breadcrumbs: breadcrumbs.concat({ href: `/app/klanten/${params.id}/systems`, label: "Systemen" }),
    systems: await systems.list(params.id)
  }
}