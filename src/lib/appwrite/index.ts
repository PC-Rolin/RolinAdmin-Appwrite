import { PUBLIC_APPWRITE_PROJECT } from "$env/static/public";

export { createClient } from "./client";

export const COOKIE = `a_session_${PUBLIC_APPWRITE_PROJECT}` as const