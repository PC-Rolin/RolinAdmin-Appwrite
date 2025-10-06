<script lang="ts">
  import { getContext } from "svelte";
  import type { RemoteForm } from "@sveltejs/kit";
  import { Input, Label } from "$lib/components/ui";
  import type { HTMLInputAttributes } from "svelte/elements";

  let { name, label, ...rest }: {
    name: string
    label?: string
  } & HTMLInputAttributes = $props()

  const id = $props.id()
  const form = getContext<RemoteForm<any, any>>("form")
</script>

<div class="grid gap-2">
  {#if label}
    <Label for={id}>{label}</Label>
  {/if}

  <Input {...rest} {id} {...form.fields[name].as("text")}/>
</div>