<script lang="ts">
  // noinspection ES6UnusedImports
  import { Popover, buttonVariants, Table, Textarea } from "$lib/components/ui"
  import { Plus, SquarePen, Trash2 } from "@lucide/svelte"
  import { Field, Form, Modal } from "$lib/components/form"
  import * as pricelist from "$lib/remote/pricelist.remote"
  import { DBCombobox } from "$lib/components/data";

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
      <Modal title="Prijs toevoegen" triggerClass={[buttonVariants({ variant: "outline" }), "rounded-none rounded-b"]}>
        {#snippet trigger()}
          Nieuwe Prijs
        {/snippet}
        <Form form={pricelist.createPrice}>
          {#snippet children({ fields })}
            <Field field={fields.category} label="Categorie">
              {#snippet input()}
                <DBCombobox table="PRICELIST_CATEGORIES" name={fields.category.as("select").name}/>
              {/snippet}
            </Field>
            <Field field={fields.name} label="Naam" placeholder="Naam" required/>
            <Field field={fields.price} as="number" label="Prijs" placeholder="Prijs" required/>
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
      {#each category.prices as price (price.$id)}
        <Table.Row>
          <Table.Cell>{price.name}</Table.Cell>
          <Table.Cell>{Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(price.price)}</Table.Cell>
          <Table.Cell>{price.priceZakelijk ? Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(price.priceZakelijk) : '-'}</Table.Cell>
          <Table.Cell>{price.comment}</Table.Cell>
          {#if data.user?.labels.includes("admin")}
            <Table.Cell>
              <div class="flex gap-4">
                <Modal title="Prijs aanpassen" triggerClass={buttonVariants({ variant: "outline" })}>
                  {#snippet trigger()}
                    <SquarePen/>
                  {/snippet}
                  <Form form={pricelist.updatePrice} data={{ ...price, priceZakelijk: String(price.priceZakelijk) }}>
                    {#snippet children({ fields })}
                      <input {...fields.id.as("hidden", price.$id)}/>
                      <Field field={fields.category} label="Categorie">
                        {#snippet input()}
                          <DBCombobox table="PRICELIST_CATEGORIES" name={fields.category.as("select").name} value={category.$id}/>
                        {/snippet}
                      </Field>
                      <Field field={fields.name} label="Naam" placeholder="Naam" required/>
                      <Field field={fields.price} as="number" label="Prijs" placeholder="Prijs" required/>
                      <Field field={fields.priceZakelijk} as="number" label="Prijs Zakelijk" placeholder="Prijs Zakelijk"/>
                      <Field field={fields.comment} label="Opmerkingen">
                        {#snippet input()}
                          <Textarea {...fields.comment.as("text")} placeholder="Opmerkingen"/>
                        {/snippet}
                      </Field>
                    {/snippet}
                  </Form>
                </Modal>
                <Modal title="Prijs verwijderen" triggerClass={buttonVariants({ variant: "destructive" })}>
                  {#snippet trigger()}
                    <Trash2/>
                  {/snippet}
                  <Form form={pricelist.deletePrice} remove>
                    <input {...pricelist.deletePrice.fields.id.as("hidden", price.$id)}/>
                  </Form>
                </Modal>
              </div>
            </Table.Cell>
          {/if}
        </Table.Row>
      {/each}
    {/each}
  </Table.Body>
</Table.Root>