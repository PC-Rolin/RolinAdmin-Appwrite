<script lang="ts">
  // noinspection ES6UnusedImports
  import { Input, Table, Avatar, Badge, DropdownMenu } from "$lib/components/ui"
  import { X, ChevronDown } from "@lucide/svelte"
  import * as daily from "$lib/remote/daily.remote"
  import * as wticket from "$lib/remote/wticket.remote"
  import * as customers from "$lib/remote/customers.remote"
  import * as users from "$lib/remote/users.remote"
  import { onMount } from "svelte";
  import type { RealtimeResponseEvent, Models } from "appwrite";
  import type { Daily } from "$lib/appwrite/types";
  import { Select } from "$lib/components/form";

  let { data } = $props()

  const profiles = await users.list()

  onMount(() => {
    function isUpdateResponse(response: RealtimeResponseEvent<unknown>): response is RealtimeResponseEvent<Daily & Models.Row> {
      return response.events.includes("databases.*.tables.*.rows.*.update")
    }
    function isCreateResponse(response: RealtimeResponseEvent<unknown>): response is RealtimeResponseEvent<Daily & Models.Row> {
      return response.events.includes("databases.*.tables.*.rows.*.create")
    }
    function isDeleteResponse(response: RealtimeResponseEvent<unknown>): response is RealtimeResponseEvent<Daily & Models.Row> {
      return response.events.includes("databases.*.tables.*.rows.*.delete")
    }

    return data.realtime.subscribe("databases.rolinadmin.tables.daily.rows", async response => {
      if (isUpdateResponse(response)) {
        const index = tickets.findIndex(ticket => ticket.$id === response.payload.$id)
        tickets[index] = response.payload
      } else if (isCreateResponse(response)) {
        tickets = [response.payload, ...tickets]
      } else if (isDeleteResponse(response)) {
        const index = tickets.findIndex(ticket => ticket.$id === response.payload.$id)
        tickets.splice(index, 1)
      }
    })
  })

  let tickets = $state(await daily.list())
  let editingTicket = $state<string | undefined>(undefined)
  let myTickets = $state(false)
  let ticketsFilter = $state<string | undefined>(undefined)
</script>

<div class="flex gap-2">
  <Badge variant={myTickets ? "default" : "outline"} class="py-1 px-2 rounded-full cursor-pointer select-none" onclick={() => myTickets = !myTickets}>
    Mijn tickets
  </Badge>
  {#if data.user?.labels.includes("admin")}
    <div class="flex divide-x">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Badge variant={ticketsFilter ? "default" : "outline"} class={["py-1 px-2 rounded-full cursor-pointer", ticketsFilter && "rounded-r-none"]}>
            Tickets van
            {profiles.find(profile => profile.$id === ticketsFilter)?.name}
            <ChevronDown/>
          </Badge>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>Tickets van</DropdownMenu.Label>
          <Select value={ticketsFilter} options={profiles.map(profile => ({
            label: profile.name,
            value: profile.$id
          }))} onValueChange={value => ticketsFilter = value}/>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      {#if ticketsFilter}
        <Badge class="rounded-l-none rounded-r-full cursor-pointer" onclick={() => ticketsFilter = undefined}>
          <X/>
        </Badge>
      {/if}
    </div>
  {/if}
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
          <Table.Cell>
            {@const user = profiles.find(profile => profile.$id === item.agent)}
            {#if item.agent && user}
              <span class="flex items-center gap-2">
                <Avatar.Root class="size-8">
                  <Avatar.Image src={data.aw.avatars.getInitials({ name: user.name })}/>
                </Avatar.Root>
                {#if editingTicket === item.$id && data.user?.labels.includes("admin") && !item.completedBy}
                  <Select allowDeselect options={profiles.map(profile => ({
                    label: profile.name,
                    value: profile.$id
                  }))} value={item.agent} onValueChange={() => {}}/>
                  <span>{user.name}</span>
                {:else}
                  <span>{user.name}</span>
                {/if}
              </span>
            {:else if editingTicket === item.$id && data.user?.labels.includes("admin")}
              <Select options={profiles.map(profile => ({
                label: profile.name,
                value: profile.$id
              }))}/>
            {/if}
          </Table.Cell>
          <Table.Cell class={item.prio === 1 ? "text-destructive" : item.prio === 2 ? "text-yellow-400" : item.prio === 3 ? "text-green-600" : undefined}>
            {item.prio}
          </Table.Cell>
          <Table.Cell>{item.status}</Table.Cell>
          <Table.Cell>{item.completedBy}</Table.Cell>
          <Table.Cell></Table.Cell>
        </Table.Row>
      {/if}
    {/each}
  </Table.Body>
</Table.Root>