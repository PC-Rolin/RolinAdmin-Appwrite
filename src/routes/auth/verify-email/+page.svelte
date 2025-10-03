<script lang="ts">
  // noinspection ES6UnusedImports
  import { Card } from "$lib/components/ui"

  let { data } = $props()
</script>

<div class="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
  <div class="flex w-full max-w-sm flex-col gap-6">
    <img src="/logo.png" alt="RolinAdmin"/>
    <div class="flex flex-col gap-6">
      <Card.Root>
        <Card.Header class="text-center">
          <Card.Title class="text-xl">Klik de link in je e-mail</Card.Title>
          <Card.Description>Klik de link die je in je e-mail hebt gekregen: {data.user?.email}</Card.Description>
        </Card.Header>
      </Card.Root>
    </div>
  </div>
</div>