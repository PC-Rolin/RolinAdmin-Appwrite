<script lang="ts">
  // noinspection ES6UnusedImports
  import { Card } from "$lib/components/ui"
  import * as auth from "$lib/remote/auth.remote"
  import { Field, Form } from "$lib/components/form";
</script>

<div class="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
  <div class="flex w-full max-w-sm flex-col gap-6">
    <img src="/logo.png" alt="RolinAdmin"/>
    <div class="flex flex-col gap-6">
      <Card.Root>
        <Card.Header class="text-center">
          <Card.Title class="text-xl">Welkom terug</Card.Title>
          <Card.Description>Log in om verder te gaan</Card.Description>
        </Card.Header>
        <Card.Content>
          <Form form={auth.login} submitButtonLabel="Login">
            {#snippet children({ fields })}
              <Field field={fields.email} as="email" label="Email" required/>
              <Field field={fields._password} as="password" label="Wachtwoord" required/>
            {/snippet}
          </Form>
        </Card.Content>
      </Card.Root>
    </div>
  </div>
</div>