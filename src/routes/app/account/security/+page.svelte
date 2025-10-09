<script lang="ts">
  // noinspection ES6UnusedImports
  import { Card } from "$lib/components/ui"
  import { Field, Form } from "$lib/components/form"
  import * as auth from "$lib/remote/auth.remote"
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Wachtwoord</Card.Title>
  </Card.Header>
  <Card.Content>
    <Form form={auth.updatePassword}>
      {#snippet children({ fields })}
        <Field field={fields._oldPassword} label="Oud wachtwoord" placeholder="Oud wachtwoord" as="password"/>
        <Field field={fields._password} label="Nieuw wachtwoord" placeholder="Nieuw wachtwoord" as="password"/>
      {/snippet}
    </Form>
  </Card.Content>
</Card.Root>