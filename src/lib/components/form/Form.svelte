<script lang="ts" generics="T extends Record<string, string>">
  // noinspection ES6UnusedImports
  import { Button, Field, Spinner } from "$lib/components/ui";
  import type { RemoteForm } from "@sveltejs/kit";
  import type { Snippet } from "svelte";
  import forms from "$lib/utils/forms";

  let { form, children, remove = false }: {
    form: RemoteForm<T, any> | Omit<RemoteForm<T, any>, "for">
    children: Snippet<[{ fields: typeof form.fields }]>
    remove?: boolean
  } = $props()
</script>

<form {...forms.apply(form)}>
  <Field.Set>
    <Field.Group>
      {@render children({ fields: form.fields })}
    </Field.Group>
    <Field.Field orientation={remove ? "horizontal" : "vertical"}>
      {#if remove}
        <Button variant="outline" onclick={forms.close}>
          Annuleren
        </Button>
        <Button variant="destructive" type="submit" disabled={!!form.pending}>
          {#if form.pending}
            <Spinner/>
            Laden...
          {:else}
            Verwijderen
          {/if}
        </Button>
      {:else}
        <Button type="submit" disabled={!!form.pending}>
          {#if form.pending}
            <Spinner/>
            Laden...
          {:else}
            Opslaan
          {/if}
        </Button>
      {/if}
    </Field.Field>
  </Field.Set>
</form>