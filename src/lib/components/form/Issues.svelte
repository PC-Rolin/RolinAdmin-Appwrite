<script lang="ts">
  // noinspection ES6UnusedImports
  import { Field } from "$lib/components/ui"
  import type { RemoteFormIssue } from "@sveltejs/kit"

  let { issues }: { issues: RemoteFormIssue[] | undefined } = $props()
</script>

{#each issues ?? [] as issue}
  <Field.Error>{issue.message}</Field.Error>
{/each}