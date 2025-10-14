<script lang="ts">
  // noinspection ES6UnusedImports
  import { Accordion, Badge, Button, Table, buttonVariants, Checkbox } from "$lib/components/ui"
  import type { System } from "$lib/appwrite/types"
  import { ShieldCheck, Headset, DatabaseBackup, Check, X, Settings2, Trash2 } from "@lucide/svelte";
  import * as systems from "$lib/remote/systems.remote"
  import { Field, Form, Modal } from "$lib/components/form";
  import { Combobox, DBCombobox } from "$lib/components/data";
  import { Query } from "appwrite";

  let { data, params } = $props()

  const options: { value: string, label: string }[] = [
    {
      label: "Geen",
      value: "0"
    },
    {
      label: "Veilig Online",
      value: "1"
    },
    {
      label: "Veilig Online + Support",
      value: "2"
    },
    {
      label: "Veilig Online + Backup",
      value: "3"
    },
    {
      label: "Veilig Online + Support + Backup",
      value: "4"
    },
    {
      label: "Backup Only",
      value: "5"
    }
  ]
</script>

{#snippet PackageIcon(systemPackage: System["package"])}
  {#if systemPackage === 1}
    <ShieldCheck/>
  {:else if systemPackage === 2}
    <ShieldCheck/> <Headset />
  {:else if systemPackage === 3}
    <ShieldCheck/> <DatabaseBackup />
  {:else if systemPackage === 4}
    <ShieldCheck/> <Headset /> <DatabaseBackup />
  {:else if systemPackage === 5}
    <DatabaseBackup />
  {:else}
    -
  {/if}
{/snippet}

<Accordion.Root type="multiple" value={["systemen"]} class="flex flex-col gap-4">
  {#if data.systems.db.length > 0}
    <Accordion.Item class="bg-muted px-4 rounded-lg">
      <Accordion.Trigger>Ongekoppelde pakketten</Accordion.Trigger>
      <Accordion.Content>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Pakket</Table.Head>
              <Table.Head>Naam</Table.Head>
              <Table.Head>Contact</Table.Head>
              <Table.Head>Acties</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each data.systems.db as system (system.$id)}
              {@const contactPerson = data.customer.contactPersons.find(contactPerson => system.contactPerson === contactPerson.$id)}
              <Table.Row>
                <Table.Cell>{@render PackageIcon(system.package)}</Table.Cell>
                <Table.Cell>-</Table.Cell>
                <Table.Cell>{contactPerson?.name ?? '-'}</Table.Cell>
                <Table.Cell>
                  <div class="flex gap-2">
                    <Modal title="Systeem verwijderen uit onze database" triggerClass={buttonVariants({ variant: "destructive" })}>
                      {#snippet trigger()}
                        <Trash2/>
                      {/snippet}
                      <Form form={systems.remove} remove>
                        {#snippet children({ fields })}
                          <input {...fields.id.as("hidden", system.$id)}/>
                        {/snippet}
                      </Form>
                    </Modal>
                  </div>
                </Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      </Accordion.Content>
    </Accordion.Item>
  {/if}
  {#if data.systems.ninja.length > 0}
    <Accordion.Item>
      <Accordion.Trigger class="bg-muted px-4 rounded-lg">Ninja Systemen (Nog Koppelen)</Accordion.Trigger>
      <Accordion.Content>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Naam</Table.Head>
              <Table.Head>Systeemnaam</Table.Head>
              <Table.Head>Serienummer</Table.Head>
              <Table.Head>Acties</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each data.systems.ninja as system (system.id)}
              <Table.Row>
                <Table.Cell>{system.displayName ?? '-'}</Table.Cell>
                <Table.Cell>{system.systemName}</Table.Cell>
                <Table.Cell>{system.system.serialNumber}</Table.Cell>
                <Table.Cell class="flex gap-2">
                  <Button variant="outline" href="https://eu.ninjarmm.com/#/deviceDashboard/{system.id}/overview" target="_blank">
                    <img src="https://eu.ninjarmm.com/img/favicon.png" alt="Ninja" class="size-4"/>
                  </Button>
                  <Modal title="Systeem Aanpassen" triggerClass={buttonVariants({ variant: "outline" })}>
                    {#snippet trigger()}
                      <Settings2/>
                    {/snippet}
                    <Form form={systems.upsert}>
                      {#snippet children({ fields })}
                        <input {...fields.ninja.as("hidden", String(system.id))}>
                        <input {...fields.customer.as("hidden", params.id)}>

                        <Field field={fields.contactPerson} label="Contactpersoon">
                          {#snippet input()}
                            <DBCombobox
                              table="CONTACT_PERSONS"
                              {...fields.contactPerson.as("select")}
                              required
                              queries={[Query.equal("customer", params.id)]}
                            />
                          {/snippet}
                        </Field>
                        <Field field={fields.package} label="Pakket">
                          {#snippet input()}
                            <Combobox {...fields.package.as("select")} {options} required/>
                          {/snippet}
                        </Field>
                        <Field field={fields.hasSyncback} label="SyncBack Back-up">
                          {#snippet input(id)}
                            <Checkbox {id} class="!size-4" checked={fields.hasSyncback.value()} name={fields.hasSyncback.as("checkbox").name}/>
                          {/snippet}
                        </Field>
                      {/snippet}
                    </Form>
                  </Modal>
                </Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      </Accordion.Content>
    </Accordion.Item>
  {/if}
  <Accordion.Item value="systemen" disabled>
    <Accordion.Trigger class="bg-muted px-4 rounded-lg cursor-default hover:no-underline">Systemen</Accordion.Trigger>
    <Accordion.Content>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Pakket</Table.Head>
            <Table.Head>Naam</Table.Head>
            <Table.Head>Systeemnaam</Table.Head>
            <Table.Head>Serienummer</Table.Head>
            <Table.Head>SyncBack</Table.Head>
            <Table.Head>Contact</Table.Head>
            <Table.Head>Acties</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each data.systems.combined as system (system.$id)}
            {@const contactPerson = data.customer.contactPersons.find(contactPerson => system.contactPerson === contactPerson.$id)}
            <Table.Row>
              <Table.Cell>{@render PackageIcon(system.package)}</Table.Cell>
              <Table.Cell>{system.displayName ?? '-'}</Table.Cell>
              <Table.Cell>{system.systemName}</Table.Cell>
              <Table.Cell>{system.system.serialNumber}</Table.Cell>
              <Table.Cell>
                {#if system.hasSyncback}
                  <Badge class="bg-green-600 rounded-full p-2">
                    <Check/>
                    Ja
                  </Badge>
                {:else}
                  <Badge class="bg-red-600 rounded-full p-2">
                    <X/>
                    Nee
                  </Badge>
                {/if}
              </Table.Cell>
              <Table.Cell>{contactPerson?.name ?? '-'}</Table.Cell>
              <Table.Cell>
                <div class="flex gap-2">
                  <Button variant="outline" href="https://eu.ninjarmm.com/#/deviceDashboard/{system.id}/overview" target="_blank">
                    <img src="https://eu.ninjarmm.com/img/favicon.png" alt="Ninja" class="size-4"/>
                  </Button>
                  <Modal title="Systeem Aanpassen" triggerClass={buttonVariants({ variant: "outline" })}>
                    {#snippet trigger()}
                      <Settings2/>
                    {/snippet}
                    <Form form={systems.upsert} data={{
                    ...system,
                    id: system.$id,
                    ninja: String(system.id),
                    package: String(system.package)
                  }}>
                    {#snippet children({ fields })}
                      <input {...fields.id.as("hidden", system.$id)}/>
                      <input {...fields.ninja.as("hidden", String(system.id))}>
                      <input {...fields.customer.as("hidden", params.id)}>

                      <Field field={fields.contactPerson} label="Contactpersoon">
                        {#snippet input()}
                          <DBCombobox
                            table="CONTACT_PERSONS"
                            {...fields.contactPerson.as("select")}
                            required
                            queries={[Query.equal("customer", params.id)]}
                          />
                        {/snippet}
                      </Field>
                      <Field field={fields.package} label="Pakket">
                        {#snippet input()}
                          <Combobox {...fields.package.as("select")} {options} required/>
                        {/snippet}
                      </Field>
                      <Field field={fields.hasSyncback} label="SyncBack Back-up">
                        {#snippet input(id)}
                          <Checkbox {id} class="!size-4" checked={fields.hasSyncback.value()} name={fields.hasSyncback.as("checkbox").name}/>
                        {/snippet}
                      </Field>
                    {/snippet}
                    </Form>
                  </Modal>
                  <Modal title="Systeem verwijderen uit onze database" triggerClass={buttonVariants({ variant: "destructive" })}>
                    {#snippet trigger()}
                      <Trash2/>
                    {/snippet}
                    <Form form={systems.remove} remove>
                      {#snippet children({ fields })}
                        <input {...fields.id.as("hidden", system.$id)}/>
                      {/snippet}
                    </Form>
                  </Modal>
                </div>
              </Table.Cell>
            </Table.Row>
          {:else}
            <Table.Row>
              <Table.Cell colspan={7} class="text-center font-bold">Geen resultaten gevonden</Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>