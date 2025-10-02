import { APPWRITE_SSR_KEY } from "$env/static/private";
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT } from "$env/static/public";
import { Account, Client } from "node-appwrite";

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