import type { LayoutServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ locals }) => {
  if (!locals.user?.labels.includes("admin")) {
    error(401, "Je hebt niet genoeg rechten om deze pagina te bekijken")
  }
}