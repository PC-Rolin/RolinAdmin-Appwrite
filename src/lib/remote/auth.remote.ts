import { form, getRequestEvent } from "$app/server";
import { z } from "zod";
import { SSRClient } from "appwrite-sveltekit";
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT } from "$env/static/public";
import { APPWRITE_SSR_KEY } from "$env/static/private";

export const login = form(z.object({
  email: z.email(),
  _password: z.string().min(6)
}), async data => {
  const { cookies } = getRequestEvent()
  const { account } = new SSRClient(PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT, APPWRITE_SSR_KEY, {
    cookies: {
      set(name, value, opts) {
        cookies.set(name, value, opts)
      }
    }
  })

  await account.createEmailPasswordSession({
    email: data.email,
    password: data._password
  })
})