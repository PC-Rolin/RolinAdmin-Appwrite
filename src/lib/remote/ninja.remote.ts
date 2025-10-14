import { query } from "$app/server";
import { createNinjaClient } from "$lib/server/ninja";

export const listOrganizations = query(async () => {
  const ninja = await createNinjaClient()
  return ninja.system.listOrganizations()
})

export const listOrganizationsCombobox = query(async () => {
  const organizations = await listOrganizations()
  return organizations.map(organization => ({
    label: organization.name,
    value: String(organization.id)
  }))
})