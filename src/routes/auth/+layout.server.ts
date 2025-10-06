import type { LayoutServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { AppwriteException } from "appwrite";

export const load: LayoutServerLoad = async ({ locals, url }) => {
  try {
    locals.user = await locals.appwrite.account.get()
  } catch (err) {
    locals.user = undefined
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

  if (locals.user) {
    if (!locals.user.emailVerification) return
    redirect(302, "/app")
  }
}