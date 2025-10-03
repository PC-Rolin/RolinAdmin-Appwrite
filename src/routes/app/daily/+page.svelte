<script lang="ts">
  // noinspection ES6UnusedImports
  import { Input, Table } from "$lib/components/ui"
  import * as daily from "$lib/remote/daily.remote"
  import * as wticket from "$lib/remote/wticket.remote"
  import * as customers from "$lib/remote/customers.remote"

  let { data } = $props()

  let tickets = $state(await daily.list())
  let editingTicket = $state<string | undefined>(undefined)
  let myTickets = $state(false)
  let ticketsFilter = $state<string | undefined>(undefined)
</script>

<div class="flex gap-2">

</div>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>Ticket</Table.Head>
      <Table.Head>Wie</Table.Head>
      <Table.Head>Prio</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head>Afvink</Table.Head>
      <Table.Head>Acties</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each tickets as item (item.$id)}
      {#if (!myTickets || item.agent === data.user?.$id) && (!ticketsFilter || item.agent === ticketsFilter)}
        <Table.Row class={[item.completedBy && "bg-green-900 hover:bg-green-800", editingTicket === item.$id && "bg-accent hover:bg-muted"]}>
          <Table.Cell>
            <div class="flex items-center gap-4">
              {#if editingTicket === item.$id && data.user?.labels.includes("admin") && !item.completedBy}
                <Input type="number" value={item.ticket} class="w-24"/>
              {:else}
                <span class="font-medium">{item.ticket}</span>
              {/if}
              {#await wticket.getTicket(item.ticket) then ticket}
                {#if ticket}
                  {#await wticket.getRelation(ticket.searchName) then relation}
                    {#if relation}
                      {#await customers.getByWTicket(relation.number) then customer}
                        <a class="text-primary" href="/app/klanten/{customer.$id}">{customer.name}</a>
                      {:catch error}
                        <span class="text-primary opacity-75" title={error}>{relation.fullName}</span>
                      {/await}
                    {/if}
                  {/await}
                  <span>{ticket.description}</span>
                {:else}
                  <span class="text-destructive">Ticket niet gevonden</span>
                {/if}
              {/await}
            </div>
          </Table.Cell>
          <Table.Cell>{item.agent}</Table.Cell>
          <Table.Cell>{item.prio}</Table.Cell>
          <Table.Cell>{item.status}</Table.Cell>
          <Table.Cell>{item.completedBy}</Table.Cell>
          <Table.Cell></Table.Cell>
        </Table.Row>
      {/if}
    {/each}
  </Table.Body>
</Table.Root>