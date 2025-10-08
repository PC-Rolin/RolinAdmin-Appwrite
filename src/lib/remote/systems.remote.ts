import { query } from "$app/server";
import { z } from "zod";
import { createNinjaClient } from "$lib/server/ninja";
import * as customers from "$lib/remote/customers.remote"
import type { DeviceDetails } from "ninja-api";
import type { System } from "$lib/appwrite/types";
import type { Models } from "appwrite";

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

  return { dbSystems, ninjaSystems, combinedSystems }
})