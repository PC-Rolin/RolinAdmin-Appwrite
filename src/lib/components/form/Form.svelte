<script lang="ts" generics="T extends Record<string, any>, R extends Record<string, any> | void">
  // noinspection ES6UnusedImports
  import { Button, Field, Spinner } from "$lib/components/ui";
  import type { RemoteForm } from "@sveltejs/kit";
  import type { Snippet } from "svelte";
  import forms from "$lib/utils/forms";

  let { form, children, remove = false, onSuccess, reset = true, disableSubmit = false, ...rest }: {
    form: RemoteForm<T, R> | Omit<RemoteForm<T, R>, "for">
    children: Snippet<[{ fields: typeof form.fields }]>
    remove?: boolean
    onSuccess?(result: R): void
    reset?: boolean
    disableSubmit?: boolean
    submitButtonLabel?: string
  } = $props()
</script>

<form {...forms.apply(form, {
  reset,
  onSuccess(result) {
    if (onSuccess) onSuccess(result)
  }
})}>
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
        <Button type="submit" disabled={!!form.pending || disableSubmit}>
          {#if form.pending}
            <Spinner/>
            Laden...
          {:else}
            {rest.submitButtonLabel ?? "Opslaan"}
          {/if}
        </Button>
      {/if}
    </Field.Field>
  </Field.Set>
</form>