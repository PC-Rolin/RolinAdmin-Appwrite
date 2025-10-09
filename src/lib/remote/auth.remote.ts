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

export const updateName = form(z.object({
  name: z.string()
}), async data => {
  const { locals } = getRequestEvent()

  await locals.account.updateName({
    name: data.name
  })

  return { message: "Naam aangepast" }
})

export const updatePassword = form(z.object({
  _password: z.string(),
  _oldPassword: z.string()
}), async data => {
  const { locals } = getRequestEvent()

  await locals.account.updatePassword({
    password: data._password,
    oldPassword: data._oldPassword
  })

  return { message: "Wachtwoord aangepast" }
})