<script lang="ts">
  // noinspection ES6UnusedImports
  import { Card, Badge, Tabs } from "$lib/components/ui"
  import { page } from "$app/state";

  let { data, children, params } = $props()
</script>

<Card.Root class="mb-4">
  <Card.Content>
    <div class="flex gap-4">
      <div>
        <h1 class="text-3xl font-medium mb-1">{data.customer.name}</h1>
        <div class="flex gap-2">
          <Badge>{data.customer.type}</Badge>
          <Badge variant="outline">
            <img src="https://wticket-pcrolin.multitrader.nl/login/wf/favicon.png" alt="WTicket" class="size-3">
            {data.customer.wticket}
          </Badge>
          {#if data.customer.ninjaOrganization}
            <a href="https://eu.ninjarmm.com/#/customerDashboard/{data.customer.ninjaOrganization}/overview" target="_blank">
              <Badge variant="outline">
                <img src="https://eu.ninjarmm.com/img/favicon.png" alt="Ninja" class="size-3">
                {data.customer.ninjaOrganization}
              </Badge>
            </a>
          {/if}
          {#if data.customer.snelstartId}
            <Badge variant="outline">
              <img src="https://favicon.is/snelstart.nl" alt="Snelstart" class="size-3">
              {data.customer.snelstartId}
            </Badge>
          {/if}
        </div>
      </div>
    </div>
  </Card.Content>
</Card.Root>

<Tabs.Root value={page.url.pathname} class="mb-4">
  <Tabs.List class="w-full">
    <Tabs.Trigger value="/app/klanten/{params.id}">
      {#snippet child({ props })}
        <a {...props} href="/app/klanten/{params.id}">Info</a>
      {/snippet}
    </Tabs.Trigger>
    <Tabs.Trigger value="/app/klanten/{params.id}/systems">
      {#snippet child({ props })}
        <a {...props} href="/app/klanten/{params.id}/systems">Systemen</a>
      {/snippet}
    </Tabs.Trigger>
  </Tabs.List>

  {@render children()}
</Tabs.Root>