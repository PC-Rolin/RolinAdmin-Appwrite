import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
  await locals.appwrite.account.raw.createVerification({
    url: `${url.origin}/auth/callback/verify`
  })
}