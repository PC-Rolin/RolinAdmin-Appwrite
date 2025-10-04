import type { LayoutLoad } from "./$types"
import * as customers from "$lib/remote/customers.remote"

export const load: LayoutLoad = async ({ params, parent }) => {
  const { breadcrumbs } = await parent()
  const customer = await customers.get(params.id)

  return {
    customer,
    breadcrumbs: breadcrumbs.concat({ href: `/app/klanten/${params.id}`, label: customer.name })
  }
}