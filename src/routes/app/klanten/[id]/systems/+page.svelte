<script lang="ts">
  // noinspection ES6UnusedImports
  import { Accordion, Table } from "$lib/components/ui"
  import type { System } from "$lib/appwrite/types"
  import { ShieldCheck, Headset, DatabaseBackup } from "@lucide/svelte";

  let { data } = $props()

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

  console.log(data.systems)
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
  {#if data.systems.dbSystems.length > 0}
    <Accordion.Item class="bg-muted px-4 rounded-lg">
      <Accordion.Trigger>Ongekoppelde pakketten</Accordion.Trigger>
      <Accordion.Content>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Pakket</Table.Head>
              <Table.Head>Naam</Table.Head>
              <Table.Head>Contact</Table.Head>
              <Table.Head>Edit</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each data.systems.dbSystems as system (system.$id)}
              <Table.Row>
                <Table.Cell>{@render PackageIcon(system.package)}</Table.Cell>
                <Table.Cell>-</Table.Cell>
                <Table.Cell>{system.contactPerson?.name ?? '-'}</Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      </Accordion.Content>
    </Accordion.Item>
  {/if}
</Accordion.Root>