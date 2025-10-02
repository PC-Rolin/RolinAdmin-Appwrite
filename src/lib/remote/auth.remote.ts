import { form, getRequestEvent } from "$app/server";
import { z } from "zod";
import { createSSRClient } from "$lib/server/appwrite";
import { COOKIE } from "$lib/appwrite";

export const login = form(z.object({
  email: z.email(),
  _password: z.string().min(6)
}), async data => {
  const { cookies } = getRequestEvent()
  const { account } = createSSRClient()

  const session = await account.createEmailPasswordSession({
    email: data.email,
    password: data._password
  })

  cookies.set(COOKIE, session.secret, {
    sameSite: "strict",
    expires: new Date(session.expire),
    secure: true,
    path: "/"
  })
})