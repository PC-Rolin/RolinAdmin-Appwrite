import { query } from "$app/server";
import { z } from "zod";
import { api, bot } from "$lib/server/wticket";

async function login() {
  const { error } = await bot.auth.status()
  if (error) {
    await bot.auth.login({
      username: "rolinadmin",
      password: "rolininlog"
    })
  }
}

export const getTicket = query.batch(z.number(), async ids => {
  await login()
  const tickets: NonNullable<Awaited<ReturnType<typeof bot.ticket.get>>["data"]>[] = []

  await Promise.all(ids.map(async id => {
    const result = await bot.ticket.get(id)
    if (result.data) tickets.push(result.data)
  }))

  return id => tickets.find(ticket => ticket.id === id)
})

export const getRelation = query(z.string(), async searchName => {
  const response = await api.common.listRelations({ searchKey: searchName })
  if (response.relation) {
    return api.relation.get(response.relation.id)
  }
})