import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT } from "$env/static/public";
import { env } from "$env/dynamic/public"
import { Client } from "appwrite";
import { browser, dev } from "$app/environment";
import { COOKIE } from "$lib/appwrite";

export function createClient(session?: string) {
  const client = new Client()
    .setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
    .setProject(PUBLIC_APPWRITE_PROJECT)
  ;

  if (dev && env.PUBLIC_APPWRITE_DEV_KEY) client.setDevKey(env.PUBLIC_APPWRITE_DEV_KEY)

  if (session) {
    client.setSession(session)

    if (browser) {
      window.localStorage.setItem("cookieFallback", JSON.stringify({
        [COOKIE]: session
      }))
    }
  }

  return client
}