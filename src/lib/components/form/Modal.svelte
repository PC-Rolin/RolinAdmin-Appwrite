<script lang="ts">
  // noinspection ES6UnusedImports
  import { Dialog } from "$lib/components/ui"
  import { onMount, type Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { EVENT } from "$lib/constants";

  let { open = $bindable(false), children, trigger, title, triggerClass, onOpenChange }: {
    open?: boolean
    children: Snippet
    trigger: Snippet
    title?: string
    triggerClass?: HTMLAttributes<any>["class"]
    onOpenChange?: (value: boolean) => void
  } = $props()

  function close() {
    open = false
  }

  onMount(() => {
    addEventListener(EVENT.CLOSE_FORM, close)
    return () => removeEventListener(EVENT.CLOSE_FORM, close)
  })
</script>

<Dialog.Root bind:open {onOpenChange}>
  <Dialog.Trigger class={triggerClass}>
    {@render trigger()}
  </Dialog.Trigger>
  <Dialog.Content interactOutsideBehavior="ignore" class="max-h-[98%] overflow-auto">
    {#if title}
      <Dialog.Header>
        <Dialog.Title>{title}</Dialog.Title>
      </Dialog.Header>
    {/if}
    {@render children()}
  </Dialog.Content>
</Dialog.Root>