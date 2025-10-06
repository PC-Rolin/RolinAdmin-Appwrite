import type { PageServerLoad } from "./$types";
import { COOKIE } from "$lib/appwrite";

export const load: PageServerLoad = async ({ locals, cookies }) => {
  await locals.appwrite.account.raw.deleteSession({ sessionId: "current" })
  cookies.delete(COOKIE, { path: "/" })
}