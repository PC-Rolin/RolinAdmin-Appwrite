<script lang="ts">
  // noinspection ES6UnusedImports
  import { Table } from "$lib/components/ui"
  import * as remote from "$lib/remote/customers.remote"
  import { goto, preloadData } from "$app/navigation";

  const customers = $derived(remote.list())
</script>

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