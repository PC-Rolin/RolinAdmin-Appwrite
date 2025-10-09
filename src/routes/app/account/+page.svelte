<script lang="ts">
  // noinspection ES6UnusedImports
  import { Card } from "$lib/components/ui"
  import { Field, Form } from "$lib/components/form"
  import * as auth from "$lib/remote/auth.remote"

  let { data } = $props()

  if (data.user) {
    auth.updateName.fields.name.set(data.user.name)
  }
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Profiel</Card.Title>
  </Card.Header>
  <Card.Content>
    <Form form={auth.updateName} reset={false} disableSubmit={data.user?.name === auth.updateName.fields.name.value()}>
      {#snippet children({ fields })}
        <Field field={fields.name} label="Naam" placeholder="Naam"/>
      {/snippet}
    </Form>
  </Card.Content>
</Card.Root>