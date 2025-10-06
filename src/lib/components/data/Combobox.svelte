<script lang="ts">
  // noinspection ES6UnusedImports
  import { Button, Popover, Command } from "$lib/components/ui";
  import { type Snippet, tick } from "svelte";
  import { Check, ChevronsUpDown } from "@lucide/svelte";

  let { options, open = $bindable(false), value = $bindable(undefined), shouldFilter = true, items, name, required = false }: {
    options: { value: string, label: string }[]
    open?: boolean
    value?: string
    shouldFilter?: boolean
    items?: Snippet<[{ value: string, label: string }[]]>
    name?: string
    required?: boolean
  } = $props()

  let triggerRef = $state<HTMLButtonElement>(null!)

  const selectedValue = $derived(options.find(option => option.value === value)?.label)

  function closeAndFocusTrigger() {
    open = false
    tick().then(() => triggerRef.focus())
  }

  function filter(value: string, search: string) {
    const option = options.find(option => option.value === value)
    if (!option) return 0
    if (option.label.toLowerCase().includes(search.toLowerCase()) || option.value === search) {
      return 1
    }
    return 0
  }
</script>

{#if name}
  <input class="opacity-0 w-1 absolute" {required} {name} bind:value>
{/if}

<Popover.Root bind:open>
  <Popover.Trigger bind:ref={triggerRef}>
    {#snippet child({ props })}
      <Button
        variant="outline"
        {...props}
        class={["w-full", props.class]}
        role="combobox"
        aria-expanded={open}
      >
        {selectedValue || "Selecteren..."}
        <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50"/>
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="p-0">
    <Command.Root {shouldFilter} {filter}>
      <Command.Input placeholder="Zoeken..."/>
      <Command.List>
        <Command.Empty>Geen gevonden</Command.Empty>
        <Command.Group>
          {#if items}
            {@render items(options)}
          {:else}
            {#if options.length > 0}
              {#each options as option}
                <Command.Item
                  value={option.value}
                  onSelect={() => {
                    if (value === option.value && !required) value = undefined
                    else value = option.value
                    closeAndFocusTrigger()
                  }}
                >
                  <Check class={["mr-2 size-4", value !== option.value && "text-transparent"]}/>
                  {option.label}
                </Command.Item>
              {/each}
            {/if}
          {/if}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>