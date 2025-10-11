<script lang="ts" generics="T extends RemoteFormFieldValue">
  // noinspection ES6UnusedImports
  import { Field } from "$lib/components/ui";
  // noinspection ES6UnusedImports
  import type { RemoteFormField, RemoteFormFieldValue } from "@sveltejs/kit";
  import { Input } from "$lib/components/ui";
  import type { ComponentProps, Snippet } from "svelte";

  let { field, label, children, ...rest }: {
    field: RemoteFormField<T>
    label?: string
    children?: Snippet<[string]>
  } & ComponentProps<typeof Input> = $props()

  const inputField = field as RemoteFormField<any>

  const id = $props.id()
</script>

<Field.Field aria-invalid={!!field.issues()}>
  {#if label}
    <Field.Label for={id}>{label}</Field.Label>
  {/if}
  {#if children}
    {@render children(id)}
  {:else}
    <Input {...inputField.as("text")} {...rest} {id}/>
  {/if}
  {#each field.issues() ?? [] as issue}
    <Field.Error>{issue.message}</Field.Error>
  {/each}
</Field.Field>