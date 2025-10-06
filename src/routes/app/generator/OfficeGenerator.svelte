<script lang="ts" generics="T">
  // noinspection ES6UnusedImports
  import { Button, Card, Tabs } from "$lib/components/ui";
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
  <Card.Content>
    {#if generatedResult}
      {@render data(await generatedResult)}
    {:else}
      <Tabs.Root value="select">
        <Tabs.List>
          <Tabs.Trigger value="select">Selecteren</Tabs.Trigger>
          <Tabs.Trigger value="fill">Invullen</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="select">

        </Tabs.Content>
      </Tabs.Root>
    {/if}
  </Card.Content>
</Card.Root>