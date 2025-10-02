import type { Handle } from "@sveltejs/kit";
import { COOKIE, createClient } from "$lib/appwrite";
import { Account, TablesDB } from "appwrite";

export const handle: Handle = async ({ resolve, event }) => {
  const client = createClient(event.cookies.get(COOKIE))

  event.locals.account = new Account(client)
  event.locals.db = new TablesDB(client)

  try {
    event.locals.user = await event.locals.account.get()
  } catch {
    event.locals.user = undefined
  }

  return resolve(event, {
    transformPageChunk({ html }) {
      const dark = event.locals.user ? event.locals.user.prefs.dark === "true" : true
      return html.replace('<html lang="en">', `<html lang="en" ${dark ? 'class="dark"' : ''}>`)
    }
  })
}