import { APPWRITE_ADMIN_KEY, APPWRITE_SSR_KEY } from "$env/static/private";
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT } from "$env/static/public";
import { Account, Client } from "node-appwrite";
import { AdminClient } from "appwrite-sveltekit";

export function createSSRClient() {
  const client = new Client()
    .setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
    .setProject(PUBLIC_APPWRITE_PROJECT)
    .setKey(APPWRITE_SSR_KEY)
  ;

  return {
    get account() {
      return new Account(client)
    }
  }
}

export function createAdminClient() {
  return new AdminClient<{
    Preferences: Preferences
  }>(PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT, APPWRITE_ADMIN_KEY)
}