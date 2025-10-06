import { error, redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url, locals }) => {
  const userId = url.searchParams.get("userId")
  const secret = url.searchParams.get("secret")

  if (!userId || !secret) error(400)

  await locals.appwrite.account.raw.updateVerification({
    userId,
    secret
  })

  redirect(302, "/app")
}