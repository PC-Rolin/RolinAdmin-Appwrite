<script lang="ts">
  import { page } from "$app/state"
  import { Button } from "$lib/components/ui"
  import { ArrowLeft } from "@lucide/svelte"
</script>

<div class="flex flex-col h-full gap-4 items-center justify-center">
  <img src="/logo.png" alt="Logo" class="w-96 mb-8">
  <h1 class="font-bold text-8xl">{page.status}</h1>
  <p class="text-lg">{page.error?.message}</p>
  <Button class="mt-8" href="/">
    <ArrowLeft/>
    Terug
  </Button>
</div>