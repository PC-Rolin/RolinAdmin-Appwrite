<script lang="ts" generics="T extends Record<string, string>">
  import type { RemoteForm } from "@sveltejs/kit";
  import { setContext, type Snippet } from "svelte";

  let { form, fields }: {
    form: RemoteForm<T, any>
    fields: Snippet<[{ names: Record<keyof T, keyof T> }]>
  } = $props()

  const names = $derived(() => {
    const object: Record<keyof T, keyof T> = {}
    for (const key in form.fields) {
      object[key] = key
    }
    return object
  })

  setContext("form", form)
</script>

<form {...form}>
  {@render fields({ names: names() })}
</form>