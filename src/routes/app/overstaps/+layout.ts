import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ parent }) => {
  const { breadcrumbs } = await parent()

  return {
    breadcrumbs: breadcrumbs.concat({ href: "/app/overstaps", label: "Overstaps" })
  }
}