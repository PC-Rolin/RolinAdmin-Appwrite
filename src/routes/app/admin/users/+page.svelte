<script lang="ts">
  // noinspection ES6UnusedImports
  import { Table, Avatar, buttonVariants } from "$lib/components/ui";
  import { CircleCheck, CircleX, Plus, Trash2, CircleFadingArrowUp, RotateCcwKey } from "@lucide/svelte";
  import { Form, Field, Modal } from "$lib/components/form";
  import { list, add, remove, promote, demote, resetPassword } from "$lib/remote/admin/users.remote"

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
          <div class="flex gap-2">
            {#if user.$id === data.user?.$id}
              <i>Dit ben jij</i>
            {:else}
              <Modal title="Naam veranderen">
                {#snippet trigger()}
                {/snippet}
              </Modal>
              <Modal title="Wachtwoord resetten" triggerClass={buttonVariants({ variant: "outline" })}>
                {#snippet trigger()}
                  <RotateCcwKey/>
                {/snippet}
                {@const form = resetPassword.for(user.$id)}
                <Form {form} submitButtonLabel="Resetten">
                  <span>Bij het resetten van het wachtwoord wordt deze teruggezet naar het standaard PC Rolin' wachtwoord</span>
                  <input {...form.fields.id.as("hidden", user.$id)}/>
                </Form>
              </Modal>
              <Modal title={user.labels.includes("admin") ? `Admin rechten van ${user.name} verwijderen?` : `${user.name} admin rechten geven?`} triggerClass={buttonVariants({ variant: "outline" })}>
                {#snippet trigger()}
                  <CircleFadingArrowUp class={user.labels.includes("admin") ? "text-destructive rotate-180" : "text-green-800"}/>
                {/snippet}
                {@const form = user.labels.includes("admin") ? demote.for(user.$id) : promote.for(user.$id)}
                <Form {form}>
                  <input {...form.fields.id.as("hidden", user.$id)}/>
                </Form>
              </Modal>
              <Modal title="{user.name === '' ? 'Gebruiker' : user.name} verwijderen" triggerClass={buttonVariants({ variant: "destructive" })}>
                {#snippet trigger()}
                  <Trash2/>
                {/snippet}
                {@const form = remove.for(user.$id)}
                <Form {form} remove>
                  <input {...form.fields.id.as("hidden", user.$id)}/>
                </Form>
              </Modal>
            {/if}
          </div>
        </Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>