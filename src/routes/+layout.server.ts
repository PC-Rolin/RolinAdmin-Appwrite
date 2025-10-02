import type { LayoutServerLoad } from "./$types";
import { COOKIE } from "$lib/appwrite";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ locals, url, cookies }) => {
  if (locals.user) {
    if (url.pathname.startsWith("/auth")) redirect(302, "/app")
  } else {
    if (!url.pathname.startsWith("/auth")) redirect(302, "/auth")
  }

  return {
    user: locals.user,
    session: cookies.get(COOKIE)
  }
}