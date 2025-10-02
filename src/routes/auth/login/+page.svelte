<script lang="ts">
  // noinspection ES6UnusedImports
  import { Button, Card, Input, Label } from "$lib/components/ui"
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
          <form>
            <div class="grid gap-6">
              <div class="grid gap-3">
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="support@pcrolin.nl"
                  required
                />
              </div>
              <div class="grid gap-3">
                <Label for="password">Password</Label>
                <Input id="password" type="password" required/>
              </div>
              <Button type="submit" class="w-full">Login</Button>
            </div>
          </form>
        </Card.Content>
      </Card.Root>
    </div>
  </div>
</div>