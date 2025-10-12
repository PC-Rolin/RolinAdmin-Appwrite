<script lang="ts" generics="T extends RemoteFormFieldValue">
  // noinspection ES6UnusedImports
  import { Field } from "$lib/components/ui";
  // noinspection ES6UnusedImports
  import type { RemoteFormField, RemoteFormFieldValue } from "@sveltejs/kit";
  import { Input } from "$lib/components/ui";
  import type { ComponentProps, Snippet } from "svelte";
  import Issues from "$lib/components/form/Issues.svelte";

  let { field, label, input, as, ...rest }: {
    field: RemoteFormField<T>
    label?: string
    input?: Snippet<[string]>
    as?: Parameters<typeof field.as>[0]
  } & ComponentProps<typeof Input> = $props()

  const id = $props.id()
</script>

<Field.Field aria-invalid={!!field.issues()}>
  {#if label}
    <Field.Label for={id}>{label}</Field.Label>
  {/if}
  {#if input}
    {@render input(id)}
  {:else}
    <Input {...rest} {...field.as(as ?? "text")} {id}/>
  {/if}
  <Issues issues={field.issues()}/>
</Field.Field>