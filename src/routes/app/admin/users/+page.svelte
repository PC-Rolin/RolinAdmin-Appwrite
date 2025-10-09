<script lang="ts">
  // noinspection ES6UnusedImports
  import { Table, Avatar, buttonVariants } from "$lib/components/ui";
  import { CircleCheck, CircleX, Plus, Trash2 } from "@lucide/svelte";
  import { Form, Field, Modal } from "$lib/components/form";
  import { list, add, remove } from "$lib/remote/admin/users.remote"

  let { data } = $props()
</script>

<div class="flex">
  <Modal triggerClass={[buttonVariants(), "ml-auto"]} title="Gebruiker toevoegen">
    {#snippet trigger()}
      <Plus/>
      Toevoegen
    {/snippet}
    <Form form={add}>
      {#snippet children({ fields })}
        <Field field={fields.email} label="Email" as="email" placeholder="voorbeeld@pcrolin.nl"/>
        <Field field={fields.name} label="Naam" placeholder="Naam"/>
      {/snippet}
    </Form>
  </Modal>
</div>

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
    {#each (await list()).users as user}
      <Table.Row>
        <Table.Cell>
          {#if user.name}
            <div class="flex items-center gap-3">
              <Avatar.Root class="size-8">
                <Avatar.Image src={data.aw.avatars.getInitials({ name: user.name })}/>
              </Avatar.Root>
              <span>{user.name}</span>
            </div>
          {/if}
        </Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
        <Table.Cell>
          {#if user.labels.includes("admin")}
            <CircleCheck class="text-green-500"/>
          {:else}
            <CircleX class="text-destructive"/>
          {/if}
        </Table.Cell>
        <Table.Cell>
          {@const removeUser = remove.for(user.$id)}
          {#if user.$id === data.user?.$id}
            <i>Dit ben jij</i>
          {:else}
            <Modal title="{user.name === '' ? 'Gebruiker' : user.name} verwijderen" triggerClass={buttonVariants({ variant: "destructive" })} onOpenChange={open => {
              removeUser.fields.$id.set(user.$id)
            }}>
              {#snippet trigger()}
                <Trash2/>
              {/snippet}
              <Form form={removeUser}>
                {#snippet children({ fields })}
                  <Field field={fields.$id} as="hidden"/>
                {/snippet}
              </Form>
            </Modal>
          {/if}
        </Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>