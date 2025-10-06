import type { Handle } from "@sveltejs/kit";
import { SharedClient } from "appwrite-sveltekit";
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT } from "$env/static/public";

export const handle: Handle = async ({ resolve, event }) => {
  event.locals.appwrite = new SharedClient(PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT, {
    cookies: {
      get: event.cookies.get
    }
  })

  try {
    event.locals.user = await event.locals.appwrite.account.get()
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