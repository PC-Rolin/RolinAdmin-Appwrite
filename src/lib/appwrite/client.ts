import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT } from "$env/static/public";
import { Client } from "appwrite";
import { browser } from "$app/environment";
import { COOKIE } from "$lib/appwrite";

export function createClient(session?: string) {
  const client = new Client()
    .setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
    .setProject(PUBLIC_APPWRITE_PROJECT)
  ;

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