<script lang="ts">
  // noinspection ES6UnusedImports
  import { Table } from "$lib/components/ui";
  import { CircleCheck, CircleX } from "@lucide/svelte";

  let { data } = $props()
</script>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>Naam</Table.Head>
      <Table.Head>Email</Table.Head>
      <Table.Head>Admin</Table.Head>
      <Table.Head>Acties</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each data.users.users as user}
      <Table.Row>
        <Table.Cell>{user.name}</Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
        <Table.Cell>
          {#if user.labels.includes("admin")}
            <CircleCheck class="text-green-500"/>
          {:else}
            <CircleX class="text-destructive"/>
          {/if}
        </Table.Cell>
        <Table.Cell>
          {#if user.$id === data.user?.$id}
            <i>Dit ben jij</i>
          {/if}
        </Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>