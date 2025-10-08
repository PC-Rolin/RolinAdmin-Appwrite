import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
  await locals.account.createVerification({
    url: `${url.origin}/auth/callback/verify`
  })
}