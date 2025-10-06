<script lang="ts" generics="T">
  // noinspection ES6UnusedImports
  import { Button, Card } from "$lib/components/ui";
  import type { Customer } from "$lib/appwrite/types";
  import type { Models } from "appwrite";
  import type { Snippet } from "svelte";

  let { data, result }: {
    data: Snippet<[Awaited<T>]>
    result: (customer: Customer & Models.Row) => T
  } = $props()

  let selectedCustomer = $state("")
  let generatedResult = $state<T | undefined>(undefined)

  async function generateCustomer(event: SubmitEvent) {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const form = {
      name: formData.get("name") as string,
      wticket: Number(formData.get("wticket"))
    } as Customer & Models.Row
    generatedResult = result(form)
  }
</script>

<Card.Root class="w-full">
  <Card.Header>
    <Card.Title class="flex">
      Office 365
      {#if generatedResult}
        <Button class="ml-auto" onclick={() => {
          selectedCustomer = ""
          generatedResult = undefined
        }}>
          Opnieuw
        </Button>
      {/if}
    </Card.Title>
  </Card.Header>
  <Card.Content></Card.Content>
</Card.Root>