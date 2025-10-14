<script lang="ts">
  // noinspection ES6UnusedImports
  import { Card, Badge, Tabs, DropdownMenu, Checkbox, buttonVariants, Textarea } from "$lib/components/ui"
  import { SquarePen, Plus, Info, MapPinHouse, Component, Waypoints, ReceiptEuro, Trash2 } from "@lucide/svelte";
  import { page } from "$app/state";
  import { Field, Form, Modal, Select } from "$lib/components/form";
  import * as contactPersons from "$lib/remote/contactPersons.remote"
  import * as customers from "$lib/remote/customers.remote"
  import { Combobox } from "$lib/components/data";
  import { listOrganizationsCombobox } from "$lib/remote/ninja.remote";

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
            <DropdownMenu.Item class="p-0" closeOnSelect={false}>
              <Modal triggerClass="flex items-center gap-2 p-2" title="Klantinformatie aanpassen">
                {#snippet trigger()}
                  <Info/>
                  Klantinformatie
                {/snippet}
                <Form form={customers.updateInformation} data={data.customer}>
                  {#snippet children({ fields })}
                    <Field field={fields.name} label="Naam"/>
                    <Field field={fields.type} label="Type">
                      {#snippet input()}
                        <Select {...fields.type.as("select")} options={[{ label: "Particulier", value: "Particulier" }, { label: "Zakelijk", value: "Zakelijk" }]}/>
                      {/snippet}
                    </Field>
                    <Field field={fields.notes} label="Notities">
                      {#snippet input(id)}
                        <Textarea {id} {...fields.notes.as("text")}/>
                      {/snippet}
                    </Field>
                  {/snippet}
                </Form>
              </Modal>
            </DropdownMenu.Item>
            <DropdownMenu.Item class="p-0" closeOnSelect={false}>
              <Modal triggerClass="flex items-center gap-2 p-2" title="Adres aanpassen">
                {#snippet trigger()}
                  <MapPinHouse/>
                  Adres
                {/snippet}
                <Form form={customers.updateAddress} data={data.customer}>
                  {#snippet children({ fields })}
                    <Field field={fields.street} label="Straat"/>
                    <Field field={fields.houseNumber} label="Huisnummer"/>
                    <Field field={fields.postalCode} label="Postcode"/>
                    <Field field={fields.city} label="Plaats"/>
                  {/snippet}
                </Form>
              </Modal>
            </DropdownMenu.Item>
            <DropdownMenu.Item class="p-0" closeOnSelect={false}>
              <Modal triggerClass="flex items-center gap-2 p-2" title="Abonnementen aanpassen">
                {#snippet trigger()}
                  <Component/>
                  Abonnementen
                {/snippet}
                <Form form={customers.updateSubscriptions} data={data.customer}>
                  {#snippet children({ fields })}
                    <Field field={fields.hasOffice} label="Office">
                      {#snippet input(id)}
                        <Checkbox {id} class="!size-4" checked={fields.hasOffice.value()} name={fields.hasOffice.as("checkbox").name}/>
                      {/snippet}
                    </Field>
                  {/snippet}
                </Form>
              </Modal>
            </DropdownMenu.Item>
            <DropdownMenu.Item class="p-0" closeOnSelect={false}>
              <Modal triggerClass="flex items-center gap-2 p-2" title="Koppelingen aanpassen">
                {#snippet trigger()}
                  <Waypoints/>
                  Koppelingen
                {/snippet}
                <Form form={customers.updateConnections} data={{
                  wticket: String(data.customer.wticket),
                  ninjaOrganization: String(data.customer.ninjaOrganization),
                  snelstartId: String(data.customer.snelstartId)
                }}>
                  {#snippet children({ fields })}
                    <Field field={fields.wticket} as="number" required label="WTicket Nummer"/>
                    <Field field={fields.ninjaOrganization} label="Ninja Organisatie">
                      {#snippet input()}
                        <Combobox {...fields.ninjaOrganization.as("select")} options={await listOrganizationsCombobox()}/>
                      {/snippet}
                    </Field>
                    <Field field={fields.snelstartId} as="number" label="Snelstart ID"/>
                  {/snippet}
                </Form>
              </Modal>
            </DropdownMenu.Item>
            <DropdownMenu.Item class="p-0" closeOnSelect={false}>
              <Modal triggerClass="flex items-center gap-2 p-2" title="Facturatie aanpassen">
                {#snippet trigger()}
                  <ReceiptEuro/>
                  Facturatie
                {/snippet}
                <Form form={customers.updateInvoicing} data={data.customer}>
                  {#snippet children({ fields })}
                    <Field field={fields.invoiceEmail} as="email" label="Factuur E-Mail"/>
                    <Field field={fields.invoiceInterval} label="Factuur Interval">
                      {#snippet input()}
                        <Select {...fields.invoiceInterval.as("select")} options={[{ label: "Maand", value: "Maand" }, { label: "Kwartaal", value: "Kwartaal" }, { label: "Jaar", value: "Jaar" }]}/>
                      {/snippet}
                    </Field>
                    <Field field={fields.wantsInvoice} label="Wil Factuur">
                      {#snippet input(id)}
                        <Checkbox {id} class="!size-4" checked={fields.wantsInvoice.value()} name={fields.wantsInvoice.as("checkbox").name}/>
                      {/snippet}
                    </Field>
                    <Field field={fields.invoiceIncasso} label="Factuur Incasso">
                      {#snippet input(id)}
                        <Checkbox {id} class="!size-4" checked={fields.invoiceIncasso.value()} name={fields.invoiceIncasso.as("checkbox").name}/>
                      {/snippet}
                    </Field>
                  {/snippet}
                </Form>
              </Modal>
            </DropdownMenu.Item>
            <DropdownMenu.Item class="p-0" closeOnSelect={false}>
              <Modal triggerClass="flex items-center gap-2 p-2 text-destructive" title="Klant verwijderen">
                {#snippet trigger()}
                  <Trash2 class="text-destructive"/>
                  Verwijderen
                {/snippet}
                <Form form={customers.remove} remove/>
              </Modal>
            </DropdownMenu.Item>
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