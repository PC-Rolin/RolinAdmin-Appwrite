<script lang="ts">
  // noinspection ES6UnusedImports
  import { Badge, Card, Input, Textarea } from "$lib/components/ui"
  import { Mail, CalendarSync, RefreshCcwDot, X, Check, ReceiptEuro, MapPinHouse, StickyNote, ShieldUser, User, Phone, SearchX } from "@lucide/svelte"

  let { data } = $props()

  let contactPersonSearch = $state("")
  const contactPersons = $derived(contactPersonSearch === "" ?
    data.customer.contactPersons ?? [] :
    data.customer.contactPersons.filter(contactPerson => contactPerson.name.toLowerCase().includes(contactPersonSearch.toLowerCase()) ?? [])
  )

  function formatAddress(street: string | null, houseNumber: string | null, postalCode: string | null, city: string | null) {
    const parts = []

    if (street || houseNumber) {
      let streetPart = ''
      if (street) streetPart += street
      if (houseNumber) streetPart += (street ? ' ' : '') + houseNumber
      parts.push(streetPart)
    }

    if (postalCode || city) {
      let locationPart = ''
      if (postalCode) locationPart += postalCode
      if (city) locationPart += (postalCode ? ' ' : '') + city
      parts.push(locationPart)
    }

    const address = parts.join(', ')
    if (address === '') return null
    return address
  }
  const address = $derived(formatAddress(data.customer.street, data.customer.houseNumber, data.customer.postalCode, data.customer.city))
</script>

<div class="flex flex-col lg:flex-row gap-4">
  <Card.Root class="min-w-1/4 flex-auto">
    <Card.Header>
      <Card.Title>Klantinformatie</Card.Title>
    </Card.Header>
    <Card.Content>
      <div class="flex flex-col gap-4">
        {#if data.customer.invoiceEmail}
          <div class="flex items-center">
            <span class="flex gap-2 items-center text-muted-foreground">
              <Mail class="size-4"/>
              Factuur Email
            </span>
            <span class="font-medium ml-auto">
              <a href="mailto:{data.customer.invoiceEmail}" class="hover:underline">{data.customer.invoiceEmail}</a>
            </span>
          </div>
          <hr class="mb-0">
        {/if}
        {#if data.customer.invoiceInterval}
          <div class="flex items-center">
            <span class="flex gap-2 items-center text-muted-foreground">
              <CalendarSync class="size-4"/>
              Factuur Interval
            </span>
            <span class="font-medium ml-auto">
              {data.customer.invoiceInterval}
            </span>
          </div>
          <hr class="mb-0">
        {/if}
        <div class="flex items-center">
          <span class="flex gap-2 items-center text-muted-foreground">
            <RefreshCcwDot class="size-4"/>
            Factuur Incasso
          </span>
          <span class="font-medium ml-auto">
            <Badge class="{data.customer.invoiceIncasso ? 'bg-green-600' : 'bg-red-600'} rounded-full p-2">
              {#if data.customer.invoiceIncasso}
                <Check/>
                Ja
              {:else}
                <X/>
                Nee
              {/if}
            </Badge>
          </span>
        </div>
        <hr class="mb-0">
        <div class="flex items-center">
          <span class="flex gap-2 items-center text-muted-foreground">
            <ReceiptEuro class="size-4"/>
            Wil Factuur
          </span>
          <span class="font-medium ml-auto">
            <Badge class="{data.customer.wantsInvoice ? 'bg-green-600' : 'bg-red-600'} rounded-full p-2">
              {#if data.customer.wantsInvoice}
                <Check/>
                Ja
              {:else}
                <X/>
                Nee
              {/if}
            </Badge>
          </span>
        </div>
        <hr class="mb-0">
        <div class="flex items-center">
          <span class="flex gap-2 items-center text-muted-foreground">
            <img src="/office.svg" alt="" class="size-4"/>
            Office Abonnement
          </span>
          <span class="font-medium ml-auto">
            <Badge class="{data.customer.hasOffice ? 'bg-green-600' : 'bg-red-600'} rounded-full p-2">
              {#if data.customer.hasOffice}
                <Check/>
                Ja
              {:else}
                <X/>
                Nee
              {/if}
            </Badge>
          </span>
        </div>
        {#if address}
          <hr class="mb-0">
          <div class="flex items-center">
            <span class="flex gap-2 items-center text-muted-foreground">
              <MapPinHouse class="size-4"/>
              Adres
            </span>
            <span class="font-medium ml-auto">
              <a href="https://www.google.com/maps/search/?api=1&query={encodeURIComponent(address)}" class="hover:underline" target="_blank">{address}</a>
            </span>
          </div>
        {/if}
        {#if data.customer.notes}
          <hr class="mb-0">
          <div class="flex flex-col gap-2">
            <span class="flex gap-2 items-center text-muted-foreground">
              <StickyNote class="size-4"/>
              Notities
            </span>
            <span class="font-medium">
              <Textarea disabled class="w-full min-h-30 !cursor-default !opacity-100 bg-card" value={data.customer.notes}/>
            </span>
          </div>
        {/if}
      </div>
    </Card.Content>
  </Card.Root>
  <Card.Root class="flex-auto flex flex-col">
    <Card.Header>
      <Card.Title class="flex gap-4 items-center">
        Contactpersonen
        <Input bind:value={contactPersonSearch} placeholder="Zoeken..." class="w-64 ml-auto"/>
      </Card.Title>
    </Card.Header>
    <Card.Content class={["flex flex-col gap-4", contactPersons.length === 0 && "w-full h-full items-center opacity-50 justify-center"]}>
      {#each contactPersons as contactPerson (contactPerson.$id)}
        <div class="flex gap-4 items-center bg-muted text-muted-foreground p-4 rounded-md">
          <div class="flex items-center p-4 rounded-full bg-accent">
            {#if contactPerson.isAdmin}
              <ShieldUser/>
            {:else}
              <User/>
            {/if}
          </div>
          <div class="flex flex-col">
            <h3 class="text-lg text-foreground font-medium">{contactPerson.name}</h3>
            {#if contactPerson.email}
              <p class="flex gap-2 items-center">
                <Mail class="size-4"/>
                <a href="mailto:{contactPerson.email}" class="hover:underline">{contactPerson.email}</a>
              </p>
            {/if}
            {#if contactPerson.phone}
              <p class="flex gap-2 items-center">
                <Phone class="size-4"/>
                {contactPerson.phone}
              </p>
            {/if}
          </div>
        </div>
      {:else}
        <SearchX class="size-16"/>
        <span class="-mb-3">Geen contactpersonen gevonden</span>
        {#if data.customer.contactPersons.length === 0}
          <span class="text-sm">Voeg een contactpersoon toe om te beginnen</span>
        {/if}
      {/each}
    </Card.Content>
  </Card.Root>
</div>