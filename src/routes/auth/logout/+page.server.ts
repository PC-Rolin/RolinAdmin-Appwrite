import type { PageServerLoad } from "./$types";
import { COOKIE } from "$lib/appwrite";

export const load: PageServerLoad = async ({ locals, cookies }) => {
  await locals.account.deleteSession({ sessionId: "current" })
  cookies.delete(COOKIE, { path: "/" })
}