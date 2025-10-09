<script lang="ts">
  // noinspection ES6UnusedImports
  import { Field } from "$lib/components/ui";
  import type { RemoteFormField } from "@sveltejs/kit";
  import { Input } from "$lib/components/ui";
  import type { HTMLInputAttributes } from "svelte/elements";

  let { field, label, as = "text", ...rest }: {
    field: RemoteFormField<any>
    label?: string
    as?: "text" | "number" | "email" | "password" | "hidden"
  } & Omit<HTMLInputAttributes, "files"> = $props()

  const id = $props.id()
</script>

<Field.Field aria-invalid={!!field.issues()}>
  {#if label}
    <Field.Label for={id}>{label}</Field.Label>
  {/if}
  <Input {...rest} {id} {...field.as(as)}/>
  {#each field.issues() ?? [] as issue}
    <Field.Error>{issue.message}</Field.Error>
  {/each}
</Field.Field>