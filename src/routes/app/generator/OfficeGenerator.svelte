<script lang="ts" generics="T">
  // noinspection ES6UnusedImports
  import { Button, Card, Input, Label, Tabs } from "$lib/components/ui";
  import type { Customer } from "$lib/appwrite/types";
  import type { Models } from "appwrite";
  import type { Snippet } from "svelte";
  import { DBCombobox } from "$lib/components/data";
  import { toast } from "svelte-sonner";
  import * as customers from "$lib/remote/customers.remote"

  let { data, result }: {
    data: Snippet<[Awaited<T>]>
    result: (customer: Customer & Models.Row) => T
  } = $props()

  let selectedCustomer = $state("")
  let generatedResult = $state<Awaited<T> | undefined>(undefined)

  async function generateCustomer(event: SubmitEvent) {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const form = {
      name: formData.get("name") as string,
      wticket: Number(formData.get("wticket"))
    } as Customer & Models.Row
    generatedResult = await result(form)
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
      {@render data(generatedResult)}
    {:else}
      <Tabs.Root value="select">
        <Tabs.List>
          <Tabs.Trigger value="select">Selecteren</Tabs.Trigger>
          <Tabs.Trigger value="fill">Invullen</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="select">
          <DBCombobox table="CUSTOMERS" bind:value={selectedCustomer}/>
          <Button class="mt-4" onclick={async () => {
            if (selectedCustomer && selectedCustomer !== "") {
              try {
                const customer = await customers.get(selectedCustomer)
                generatedResult = await result(customer)
              } catch (error) {
                toast.error(String(error))
              }
            } else {
              toast.warning("Selecteer eerst een klant")
            }
          }}>
            Genereer
          </Button>
        </Tabs.Content>
        <Tabs.Content value="fill">
          <form onsubmit={generateCustomer} class="grid gap-4">
            <div class="grid gap-2">
              <Label for="name">Naam</Label>
              <Input id="name" name="name" required/>
            </div>
            <div class="grid gap-2">
              <Label for="wticket">WTicket Nummer</Label>
              <Input id="wticket" name="wticket" required/>
            </div>
            <Button type="submit" class="w-fit">Genereer</Button>
          </form>
        </Tabs.Content>
      </Tabs.Root>
    {/if}
  </Card.Content>
</Card.Root>