<script lang="ts">
  // noinspection ES6UnusedImports
  import { Select } from "$lib/components/ui"
  import type { SelectBaseRootPropsWithoutHTML, SelectSingleRootPropsWithoutHTML } from "bits-ui";

  let { options, value = $bindable(), placeholder, ...rest }: {
    options: { label: string, value: string }[]
    value?: string
    placeholder?: string
  } & SelectBaseRootPropsWithoutHTML & Omit<SelectSingleRootPropsWithoutHTML, "type" | "value"> = $props()
</script>

<Select.Root {...rest} type="single" bind:value>
  <Select.Trigger>{options.find(option => option.value === value)?.label ?? placeholder ?? "Selecteren..."}</Select.Trigger>
  <Select.Content>
    {#each options as option (option.value)}
      <Select.Item value={option.value}>{option.label}</Select.Item>
    {/each}
  </Select.Content>
</Select.Root>