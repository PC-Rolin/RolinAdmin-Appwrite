import { query } from "$app/server";
import { generate } from "generate-password";

export const generatePassword = query(async () => {
  return generate({
    length: 12,
    numbers: true,
    symbols: true,
    uppercase: true,
    excludeSimilarCharacters: true,
  })
})