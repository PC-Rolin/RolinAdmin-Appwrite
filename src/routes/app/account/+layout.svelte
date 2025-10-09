<script lang="ts">
  // noinspection ES6UnusedImports
  import { Tabs } from "$lib/components/ui"
  import { page } from "$app/state";

  let { children } = $props()
</script>

<Tabs.Root value={page.url.pathname}>
  <Tabs.List>
    <Tabs.Trigger value="/app/account">
      {#snippet child({ props })}
        <a {...props} href="/app/account">Profiel</a>
      {/snippet}
    </Tabs.Trigger>
    <Tabs.Trigger value="/app/account/security">
      {#snippet child({ props })}
        <a {...props} href="/app/account/security">Beveiliging</a>
      {/snippet}
    </Tabs.Trigger>
  </Tabs.List>

  {@render children()}
</Tabs.Root>