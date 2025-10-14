<script lang="ts">
  // noinspection ES6UnusedImports
  import { Table, Pagination, Input, buttonVariants } from "$lib/components/ui"
  import * as remote from "$lib/remote/customers.remote"
  import { goto, preloadData } from "$app/navigation"
  import { ChevronRight, ChevronLeft, Plus } from "@lucide/svelte"
  import { Field, Form, Modal, Select } from "$lib/components/form";

  let p = $state(1)
  let search = $state("")
  let autoIncasso = $state<boolean | null>(null)
  let interval = $state<string | null>(null)

  const customers = $derived(remote.list({
    page: p,
    search,
    autoIncasso,
    interval: interval as "Maand" | "Kwartaal" | "Jaar" | null
  }))
</script>

<div class="grid gap-4">
  <div class="flex items-center gap-2">
    <Input bind:value={search} class="w-fit" placeholder="Zoeken..."/>
    <Select
      allowDeselect
      options={[{ label: "Ja", value: "true" }, { label: "Nee", value: "false" }]}
      onValueChange={value => value === "" ? autoIncasso = null : autoIncasso = value === "true"}
      placeholder="Auto Incasso"
    />
    <Select
      allowDeselect
      options={[{ label: "Maand", value: "Maand" }, { label: "Kwartaal", value: "Kwartaal" }, { label: "Jaar", value: "Jaar" }]}
      onValueChange={value => value === "" ? interval = null : interval = value}
      placeholder="Interval"
    />
    <Modal title="Klant toevoegen" triggerClass={[buttonVariants(), "ml-auto"]}>
      {#snippet trigger()}
        <Plus/>
        Toevoegen
      {/snippet}
      <Form form={remote.add}>
        {#snippet children({ fields })}
          <Field field={fields.name} label="Naam" placeholder="Naam"/>
          <Field field={fields.wticket} type="number" label="WTicket Nummer" placeholder="WTicket Nummer"/>
          <Field field={fields.type} label="Type">
            {#snippet input()}
              <Select {...fields.type.as("select")} options={[{ label: "Particulier", value: "Particulier" }, { label: "Zakelijk", value: "Zakelijk" }]}/>
            {/snippet}
          </Field>
        {/snippet}
      </Form>
    </Modal>
  </div>

  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head>WTicket</Table.Head>
        <Table.Head>Snelstart</Table.Head>
        <Table.Head>Ninja</Table.Head>
        <Table.Head>Pakket</Table.Head>
        <Table.Head>Naam</Table.Head>
        <Table.Head>Plaats</Table.Head>
        <Table.Head>Type</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each (await customers).rows as customer}
        <Table.Row
          role="button"
          tabindex={0}
          class="cursor-pointer"
          onmouseenter={() => preloadData(`/app/klanten/${customer.$id}`)}
          onkeydown={event => {
          if (event.key === "Enter" || event.key === " ") {
            goto(`/app/klanten/${customer.$id}`)
          }
        }}
          onclick={() => goto(`/app/klanten/${customer.$id}`)}
        >
          <Table.Cell>{customer.wticket}</Table.Cell>
          <Table.Cell>{customer.snelstartId}</Table.Cell>
          <Table.Cell>{customer.ninjaOrganization}</Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell>{customer.name}</Table.Cell>
          <Table.Cell>{customer.city}</Table.Cell>
          <Table.Cell>{customer.type}</Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>

  <div class="flex items-center">
    <span class="flex items-center gap-2">
      <b>Totaal:</b> {(await customers).total}
    </span>
    <Pagination.Root bind:page={p} count={(await customers).total} perPage={50}>
      {#snippet children({ pages, currentPage })}
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.PrevButton>
              <ChevronLeft class="size-4"/>
              <span>Vorige</span>
            </Pagination.PrevButton>
          </Pagination.Item>
          {#each pages as page (page.key)}
            {#if page.type === "ellipsis"}
              <Pagination.Item>
                <Pagination.Ellipsis/>
              </Pagination.Item>
            {:else}
              <Pagination.Item>
                <Pagination.Link {page} isActive={currentPage === page.value}>
                  {page.value}
                </Pagination.Link>
              </Pagination.Item>
            {/if}
          {/each}
          <Pagination.Item>
            <Pagination.NextButton>
              <span>Volgende</span>
              <ChevronRight class="size-4"/>
            </Pagination.NextButton>
          </Pagination.Item>
        </Pagination.Content>
      {/snippet}
    </Pagination.Root>
  </div>
</div>