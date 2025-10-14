<script lang="ts">
  // noinspection ES6UnusedImports
  import { Card, Badge, Tabs, DropdownMenu, Checkbox, buttonVariants } from "$lib/components/ui"
  import { SquarePen, Plus } from "@lucide/svelte";
  import { page } from "$app/state";
  import { Field, Form, Modal } from "$lib/components/form";
  import * as contactPersons from "$lib/remote/contactPersons.remote"

  let { data, children, params } = $props()
</script>

<Card.Root class="mb-4">
  <Card.Content>
    <div class="flex items-center gap-4">
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

      <DropdownMenu.Root>
        <DropdownMenu.Trigger class={[buttonVariants({ variant: "secondary" }), "ml-auto"]}>
          <SquarePen/>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content side="left" align="start">
          <DropdownMenu.Group>
            <DropdownMenu.Label>Algemeen</DropdownMenu.Label>
          </DropdownMenu.Group>
          <DropdownMenu.Separator/>
          <DropdownMenu.Group>
            <DropdownMenu.Label>Contactpersonen</DropdownMenu.Label>
            <DropdownMenu.Item class="p-0" closeOnSelect={false}>
              <Modal title="Contactpersoon toevoegen" triggerClass="flex items-center gap-2 p-2">
                {#snippet trigger()}
                  <Plus/>
                  Toevoegen
                {/snippet}
                <Form form={contactPersons.add}>
                  {#snippet children({ fields })}
                    <Field field={fields.name} label="Naam"/>
                    <Field field={fields.email} as="email" label="Email"/>
                    <Field field={fields.phone} label="Telefoon"/>
                    <Field field={fields.admin} label="Admin">
                      {#snippet input(id)}
                        <Checkbox {id} class="!size-4" checked={fields.admin.value()} name={fields.admin.as("checkbox").name}/>
                      {/snippet}
                    </Field>
                  {/snippet}
                </Form>
              </Modal>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
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