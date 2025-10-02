import type { LayoutServerLoad } from "./$types";
import { COOKIE } from "$lib/appwrite";

export const load: LayoutServerLoad = async ({ cookies }) => {
  return {
    session: cookies.get(COOKIE)
  }
}