import { form, getRequestEvent, query } from "$app/server";
import { z } from "zod";
import { createNinjaClient } from "$lib/server/ninja";
import * as customers from "$lib/remote/customers.remote"
import type { DeviceDetails } from "ninja-api";
import type { System } from "$lib/appwrite/types";
import { ID, type Models } from "appwrite";
import { optional } from "$lib/remote/schemas";
import { APPWRITE } from "$lib/appwrite/config";

export const list = query(z.string(), async id => {
  const ninja = await createNinjaClient()
  const customer = await customers.get(id)

  const dbSystems = customer.systems
  const ninjaSystems: DeviceDetails[] = []
  const combinedSystems: (DeviceDetails & System & Models.Row)[] = []

  if (customer.ninjaOrganization) {
    const devices = await ninja.system.listDevicesDetailed({
      df: `org=${customer.ninjaOrganization}`
    })
    ninjaSystems.push(...devices)
  }

  for (const dbSystem of dbSystems) {
    const ninjaSystem = ninjaSystems.filter(system => {
      return system.id === dbSystem.ninja
    }).at(0)

    if (ninjaSystem) {
      combinedSystems.push({
        ...ninjaSystem,
        ...dbSystem
      })

      dbSystems.splice(dbSystems.indexOf(dbSystem), 1)
      ninjaSystems.splice(ninjaSystems.indexOf(ninjaSystem), 1)
    }
  }

  return {
    db: dbSystems,
    ninja: ninjaSystems,
    combined: combinedSystems
  }
})

export const upsert = form(z.object({
  id: optional(z.string()),
  customer: z.string(),
  ninja: z.coerce.number<string>(),
  contactPerson: z.string(),
  package: z.coerce.number<string>(),
  hasSyncback: z.coerce.boolean<boolean>()
}), async data => {
  const { locals } = getRequestEvent()

  await locals.db.upsertRow({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.SYSTEMS,
    rowId: data.id ?? ID.unique(),
    data: {
      customer: data.customer,
      ninja: data.ninja,
      package: data.package,
      contactPerson: data.contactPerson,
      hasSyncback: data.hasSyncback
    }
  })

  return { message: "Systeem opgeslagen" }
})

export const remove = form(z.object({
  id: z.string()
}), async data => {
  const { locals } = getRequestEvent()

  await locals.db.deleteRow({
    databaseId: APPWRITE.DB,
    tableId: APPWRITE.SYSTEMS,
    rowId: data.id
  })

  return { message: "Systeem verwijderd" }
})