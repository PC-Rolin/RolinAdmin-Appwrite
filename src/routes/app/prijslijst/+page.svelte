<script lang="ts">
  // noinspection ES6UnusedImports
  import { Popover, buttonVariants, Table } from "$lib/components/ui"
  import { Plus, SquarePen, Trash2 } from "@lucide/svelte"
  import { Field, Form, Modal } from "$lib/components/form"
  import * as pricelist from "$lib/remote/pricelist.remote"

  let { data } = $props()
</script>

<div class="flex mb-4">
  <Popover.Root>
    <Popover.Trigger class={[buttonVariants({ variant: "secondary" }), "ml-auto"]}>
      <Plus/>
      Toevoegen
    </Popover.Trigger>
    <Popover.Content class="w-fit p-0 border-0 flex flex-col">
      <Modal title="Categorie toevoegen" triggerClass={[buttonVariants({ variant: "outline" }), "rounded-none rounded-t"]}>
        {#snippet trigger()}
          Nieuwe Categorie
        {/snippet}
        <Form form={pricelist.createCategory}>
          {#snippet children({ fields })}
            <Field field={fields.name} label="Naam" placeholder="Naam" required/>
          {/snippet}
        </Form>
      </Modal>
    </Popover.Content>
  </Popover.Root>
</div>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>Soort Tarief</Table.Head>
      <Table.Head>Prijs</Table.Head>
      <Table.Head>Prijs Zakelijk</Table.Head>
      <Table.Head>Opmerkingen</Table.Head>
      {#if data.user?.labels.includes("admin")}
        <Table.Head>Acties</Table.Head>
      {/if}
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each await pricelist.listCategories() as category (category.$id)}
      <Table.Row class="!bg-accent">
        <Table.Cell colspan={4}>{category.name}</Table.Cell>
        {#if data.user?.labels.includes("admin")}
          <Table.Cell class="flex gap-4">
            <Modal title="Categorie aanpassen" triggerClass={buttonVariants({ variant: "secondary" })}>
              {#snippet trigger()}
                <SquarePen/>
              {/snippet}
              <Form form={pricelist.editCategory} data={category} disableSubmit={pricelist.editCategory.fields.name.value() === category.name}>
                {#snippet children({ fields })}
                  <input {...fields.id.as("hidden", category.$id)}/>
                  <Field field={fields.name} label="Naam" placeholder="Naam" required/>
                {/snippet}
              </Form>
            </Modal>
            <Modal title="Categorie verwijderen" triggerClass={buttonVariants({ variant: "destructive" })}>
              {#snippet trigger()}
                <Trash2/>
              {/snippet}
              <Form form={pricelist.deleteCategory} remove>
                <input {...pricelist.deleteCategory.fields.id.as("hidden", category.$id)}/>
              </Form>
            </Modal>
          </Table.Cell>
        {/if}
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>