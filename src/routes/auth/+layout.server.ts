import type { LayoutServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { AppwriteException, Avatars } from "appwrite";
import { createClient } from "$lib/appwrite";

export const load: LayoutServerLoad = async ({ locals, url, parent }) => {
  const data = await parent()
  const client = createClient(data.session)

  try {
    locals.user = await locals.account.get()
    if (locals.user.emailVerification) redirect(302, "/app")
  } catch (err) {
    if (err instanceof AppwriteException) {
      switch (err.type) {
        case "general_unauthorized_scope": {
          if (url.pathname !== "/auth/login") {
            return redirect(302, "/auth/login")
          }
          break
        }
        default: {
          return error(401, err.message)
        }
      }
    }
  }

  return {
    user: data.user,
    aw: {
      client,
      avatars: new Avatars(client)
    },
    breadcrumbs: []
  }
}