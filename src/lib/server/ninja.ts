import { NINJA_CLIENT_ID, NINJA_CLIENT_SECRET } from "$env/static/private";
import { NinjaClient } from "ninja-api";

export async function createNinjaClient() {
  const ninja = new NinjaClient({
    prefix: "eu",
    clientId: NINJA_CLIENT_ID,
    clientSecret: NINJA_CLIENT_SECRET
  })
  await ninja.auth.getTokenFromClientCredentials()
  return ninja
}