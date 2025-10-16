<script lang="ts">
  // noinspection ES6UnusedImports
  import { Input, Table, Avatar, Badge, DropdownMenu, Button, buttonVariants, Field, Tooltip } from "$lib/components/ui"
  import { X, ChevronDown, Trash2, Save, Pencil, Check, Plus, ListCheck } from "@lucide/svelte"
  import * as overstaps from "$lib/remote/overstaps.remote"
  import * as wticket from "$lib/remote/wticket.remote"
  import * as customers from "$lib/remote/customers.remote"
  import * as users from "$lib/remote/users.remote"
  import { onMount } from "svelte";
  import { type RealtimeResponseEvent, type Models, AppwriteException } from "appwrite";
  import type { Overstap } from "$lib/appwrite/types";
  import { Modal, Select } from "$lib/components/form";
  import { browser } from "$app/environment";
  import { toast } from "svelte-sonner";
  import forms from "$lib/utils/forms";

  let { data } = $props()

  const profiles = await users.list()

  function sortTickets(tickets: Awaited<ReturnType<typeof overstaps.list>>) {
    return tickets.sort((a, b) => {
      if (a.completedBy === null && b.completedBy !== null) return -1
      if (a.completedBy !== null && b.completedBy === null) return 1

      if (a.agent === null && b.agent !== null) return -1
      if (a.agent !== null && b.agent === null) return 1

      if (a.status === null && b.status !== null) return 1
      if (a.status !== null && b.status === null) return -1

      if (a.status && b.status && a.status !== b.status) {
        const order: NonNullable<(typeof tickets)[number]["status"]>[] = ["Voorbereiding", "Start Kloon", "Afwerking", "Nazorg"]
        return order.indexOf(a.status) - order.indexOf(b.status)
      }

      if (a.prio === null && b.prio !== null) return -1;
      if (a.prio !== null && b.prio === null) return 1;

      if (a.prio && b.prio && a.prio !== b.prio) {
        return a.prio - b.prio;
      }

      return a.ticket - b.ticket;
    })
  }

  onMount(() => {
    function isUpdateResponse(response: RealtimeResponseEvent<unknown>): response is RealtimeResponseEvent<Overstap & Models.Row> {
      return response.events.includes("databases.*.tables.*.rows.*.update")
    }
    function isCreateResponse(response: RealtimeResponseEvent<unknown>): response is RealtimeResponseEvent<Overstap & Models.Row> {
      return response.events.includes("databases.*.tables.*.rows.*.create")
    }
    function isDeleteResponse(response: RealtimeResponseEvent<unknown>): response is RealtimeResponseEvent<Overstap & Models.Row> {
      return response.events.includes("databases.*.tables.*.rows.*.delete")
    }

    return data.realtime.subscribe("databases.rolinadmin.tables.overstaps.rows", async response => {
      await users.list().refresh()
      if (isUpdateResponse(response)) {
        const index = tickets.findIndex(ticket => ticket.$id === response.payload.$id)
        tickets[index] = response.payload
        tickets = sortTickets(tickets)
      } else if (isCreateResponse(response)) {
        tickets = sortTickets([response.payload, ...tickets])
      } else if (isDeleteResponse(response)) {
        const index = tickets.findIndex(ticket => ticket.$id === response.payload.$id)
        tickets.splice(index, 1)
        tickets = sortTickets(tickets)
      }
    })
  })

  let tickets = $state(sortTickets(await overstaps.list()))
  let editingTicket = $state<string | undefined>(undefined)
  let myTickets = $state(false)
  let ticketsFilter = $state<string | undefined>(undefined)
  let changedTicket = $state<(Overstap & Models.Row) | undefined>(undefined)

  $effect(() => {
    if (browser) {
      if (editingTicket) {
        setTicket(editingTicket)
        document.addEventListener("keydown", onKeydown)
      } else {
        document.removeEventListener("keydown", onKeydown)
      }
    }
  })

  function setTicket(ticket: string | undefined) {
    if (ticket) {
      editingTicket = ticket
      changedTicket = tickets.find(value => value.$id === ticket)
    } else {
      editingTicket = undefined
      changedTicket = undefined
    }
  }

  function onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case "Enter": {
        event.preventDefault()
        const saveButton = document.getElementById(`save-${editingTicket}`)
        saveButton?.click()
        break
      }
      case "Escape": {
        event.preventDefault()
        setTicket(undefined)
        break
      }
    }
  }

  async function save() {
    if (editingTicket && changedTicket) {
      try {
        await overstaps.update(changedTicket)
        toast.success("Ticket opgeslagen")
      } catch (error) {
        if (error instanceof AppwriteException) {
          toast.error(error.message)
        } else {
          toast.error("Er is iets misgegaan")
        }
      }
    }
    setTicket(undefined)
  }

  function onTicketChange(event: Event) {
    event.preventDefault()
    const target = event.target as HTMLInputElement
    if (changedTicket) changedTicket.ticket = Number(target.value)
  }

  function onPrioChange(prio: string) {
    if (changedTicket) changedTicket.prio = prio === "" ? null : Number(prio)
  }

  function onStatusChange(value: string) {
    if (changedTicket) changedTicket.status = value === "" ? null : value as "Voorbereiding" | "Start Kloon" | "Afwerking" | "Nazorg"
  }

  function onCommentChange(event: Event) {
    event.preventDefault()
    const target = event.target as HTMLInputElement
    if (changedTicket) changedTicket.comment = target.value
  }

  function onAgentChange(agent: string) {
    if (changedTicket) changedTicket.agent = agent === "" ? null : agent
  }

  async function markAsCompleted(id: string, agent?: string) {
    try {
      await overstaps.markAsCompleted({ id, agent })
      toast.success("Gemarkeerd als voltooid")
    } catch (error) {
      if (error instanceof AppwriteException) {
        toast.error(error.message)
      } else {
        toast.error("Er is iets misgegaan")
      }
    }
  }

  async function unmarkAsCompleted(id: string) {
    try {
      await overstaps.unmarkAsCompleted(id)
      toast.success("Gemarkeerd als niet voltooid")
    } catch (error) {
      if (error instanceof AppwriteException) {
        toast.error(error.message)
      } else {
        toast.error("Er is iets misgegaan")
      }
    }
  }

  async function deleteItem(id: string) {
    try {
      await overstaps.remove(id)
      toast.success("Verwijderd")
    } catch (error) {
      if (error instanceof AppwriteException) {
        toast.error(error.message)
      } else {
        toast.error("Er is iets misgegaan")
      }
    }
  }

  async function partialComplete(id: string) {
    const ticket = tickets.find(item => item.$id === id)!
    try {
      await overstaps.update({
        ...ticket,
        agent: null,
        prio: null
      })
      toast.success("Deeltaak gemarkeerd als klaar")
    } catch (error) {
      toast.error(String(error))
    }
  }
</script>

<div class="flex items-center gap-2 mb-4">
  <Badge variant={myTickets ? "default" : "outline"} class="rounded-full cursor-pointer select-none" onclick={() => myTickets = !myTickets}>
    Mijn tickets
  </Badge>
  {#if data.user?.labels.includes("admin")}
    <div class="flex items-center divide-x">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Badge variant={ticketsFilter ? "default" : "outline"} class={["rounded-full cursor-pointer", ticketsFilter && "rounded-r-none"]}>
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
        <Badge class="h-full rounded-l-none rounded-r-full cursor-pointer" onclick={() => ticketsFilter = undefined}>
          <X/>
        </Badge>
      {/if}
    </div>
  {/if}

  <Modal triggerClass={[buttonVariants(), "ml-auto"]} title="Daily toevoegen">
    {#snippet trigger()}
      <Plus/>
      Toevoegen
    {/snippet}
    <form {...forms.apply(overstaps.add)}>
      <Field.Set>
        <Field.Group>
          <Field.Field>
            <Field.Label for="ticket">Ticket</Field.Label>
            <Input {...overstaps.add.fields.ticket.as("text")} id="ticket" type="number" placeholder="285862"/>
            {#if overstaps.add.fields.ticket.value() !== ""}
              <Field.Description>
                {#await wticket.getTicket(Number(overstaps.add.fields.ticket.value())) then ticket}
                  {ticket.description}
                {:catch _}
                  Ticket Niet Gevonden
                {/await}
              </Field.Description>
            {/if}
          </Field.Field>
        </Field.Group>
        <Field.Field>
          <Button type="submit">Opslaan</Button>
        </Field.Field>
      </Field.Set>
    </form>
  </Modal>
</div>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>Ticket</Table.Head>
      <Table.Head>Wie</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head>Prio</Table.Head>
      <Table.Head>Opmerkingen</Table.Head>
      <Table.Head>Afvink</Table.Head>
      <Table.Head>Acties</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each tickets as item (item.$id)}
      {#if (!myTickets || item.agent === data.user?.$id) && (!ticketsFilter || item.agent === ticketsFilter)}
        <Table.Row class={[item.completedBy ? "bg-green-900" : editingTicket === item.$id && "bg-accent hover:bg-muted"]}>
          <Table.Cell>
            <div class="flex items-center gap-4">
              {#if editingTicket === item.$id && data.user?.labels.includes("admin") && !item.completedBy}
                <Input type="number" value={item.ticket} class="w-24" onchange={onTicketChange}/>
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
                    {:else}
                      <span class="text-primary opacity-50">{ticket.searchName}</span>
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
                  }))} value={item.agent} onValueChange={onAgentChange}/>
                {:else}
                  <span>{user.name}</span>
                {/if}
              </span>
            {:else if editingTicket === item.$id && data.user?.labels.includes("admin")}
              <Select options={profiles.map(profile => ({
                label: profile.name,
                value: profile.$id
              }))} onValueChange={onAgentChange}/>
            {/if}
          </Table.Cell>
          <Table.Cell>
            {#if editingTicket === item.$id && data.user?.labels.includes("admin") && !item.completedBy}
              <Select allowDeselect options={[
                { label: "Voorbereiding", value: "Voorbereiding" },
                { label: "Start Kloon", value: "Start Kloon" },
                { label: "Afwerking", value: "Afwerking" },
                { label: "Nazorg", value: "Nazorg" }
              ]} value={item.status ?? undefined} onValueChange={value => onStatusChange(value)}/>
            {:else}
              {item.status}
            {/if}
          </Table.Cell>
          <Table.Cell class={item.prio === 1 ? "text-destructive" : item.prio === 2 ? "text-orange-500" : item.prio === 3 ? "text-yellow-400" : item.prio === 4 ? "text-blue-300" : undefined}>
            {#if editingTicket === item.$id && data.user?.labels.includes("admin") && !item.completedBy}
              <Select allowDeselect options={[
                { label: "1 Eerste werk uitvoeren", value: "1" },
                { label: "2 Moet vandaag af", value: "2" },
                { label: "3 Nice to have vandaag", value: "3" },
                { label: "4 WOK of laag", value: "4" }
              ]} value={item.prio?.toString()} onValueChange={value => onPrioChange(value)}/>
            {:else}
              <Tooltip.Provider delayDuration={0}>
                <Tooltip.Root>
                  <Tooltip.Trigger class="cursor-default">{item.prio}</Tooltip.Trigger>
                  <Tooltip.Content>
                    {#if item.prio === 1}
                      Eerste werk uitvoeren
                    {:else if item.prio === 2}
                      Moet vandaag af
                    {:else if item.prio === 3}
                      Nice to have vandaag
                    {:else if item.prio === 4}
                      WOK of laag
                    {/if}
                  </Tooltip.Content>
                </Tooltip.Root>
              </Tooltip.Provider>
            {/if}
          </Table.Cell>
          <Table.Cell>
            {#if editingTicket === item.$id && !item.completedBy}
              <Input value={item.comment} oninput={onCommentChange}/>
            {:else}
              {item.comment}
            {/if}
          </Table.Cell>
          <Table.Cell>
            {@const user = profiles.find(profile => profile.$id === item.completedBy)}
            {#if item.completedBy && user}
              <span class="flex items-center gap-2">
                <Avatar.Root class="size-8">
                  <Avatar.Image src={data.aw.avatars.getInitials({ name: user.name })}/>
                </Avatar.Root>
                <span>{user.name}</span>
              </span>
            {/if}
          </Table.Cell>
          <Table.Cell>
            <div class="flex items-center gap-2">
              {#if !item.completedBy}
                <div class="flex items-center">
                  {#if editingTicket === item.$id}
                    <Button id="save-{item.$id}" title="Opslaan" variant="outline" class="size-8" onclick={() => save()}>
                      <Save class="animate-pulse text-primary"/>
                    </Button>
                  {:else}
                    <Button title="Aanpassen" variant="outline" class="size-8 rounded-r-none" onclick={() => setTicket(item.$id)}>
                      <Pencil/>
                    </Button>
                    <Button title="Ticket markeren als voltooid" variant="outline" class="size-8 text-green-600 hover:text-green-600 rounded-none" onclick={() => markAsCompleted(item.$id)}>
                      <Check/>
                    </Button>
                    <Button title="Deeltaak markeren als voltooid" variant="outline" class={["size-8 text-orange-600 hover:text-orange-600", data.user?.labels.includes("admin") ? "rounded-none" : "rounded-r"]} onclick={() => partialComplete(item.$id)}>
                      <ListCheck/>
                    </Button>
                    {#if data.user?.labels.includes("admin")}
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger class={[buttonVariants({ variant: "outline" }), "!size-8 rounded-l-none"]}>
                          <ChevronDown/>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <DropdownMenu.Label>Voltooien als</DropdownMenu.Label>
                          <Select options={profiles.map(profile => {
                            return {
                              label: profile.name,
                              value: profile.$id
                            }
                          })} onValueChange={value => markAsCompleted(item.$id, value)}/>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    {/if}
                  {/if}
                </div>
              {:else if data.user?.labels.includes("admin")}
                <Button title="Markeren als niet voltooid" variant="outline" class="size-8" onclick={() => unmarkAsCompleted(item.$id)}>
                  <X/>
                </Button>
              {/if}
              {#if data.user?.labels.includes("admin")}
                <Button title="Verwijderen (klaar)" variant="outline" class="size-8 text-destructive hover:text-destructive" onclick={() => deleteItem(item.$id)}>
                  <Trash2/>
                </Button>
              {/if}
            </div>
          </Table.Cell>
        </Table.Row>
      {/if}
    {/each}
  </Table.Body>
</Table.Root>