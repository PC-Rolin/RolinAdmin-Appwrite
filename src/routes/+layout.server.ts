import type { LayoutServerLoad } from "./$types";
import { COOKIE } from "$lib/appwrite";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ locals, url, cookies }) => {
  if (locals.user) {
    if (!locals.user.emailVerification && url.pathname !== "/auth/verify-email") {
      redirect(302, "/auth/verify-email")
    }
  } else {
    if (!url.pathname.startsWith("/auth")) redirect(302, "/auth")
  }

  return {
    user: locals.user,
    session: cookies.get(COOKIE)
  }
}