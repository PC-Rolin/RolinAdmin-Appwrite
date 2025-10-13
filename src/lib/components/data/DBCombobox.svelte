<script lang="ts">
  import { Combobox } from "$lib/components/data"
  import { APPWRITE } from "$lib/appwrite/config";
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { type Models, Query } from "appwrite";

  function defaultMap(document: Models.DefaultRow) {
    return {
      value: document.$id,
      label: "name" in document ? document.name : ""
    }
  }

  let { table, value = $bindable(undefined), name, queries, map = defaultMap, required = false }: {
    table: keyof Omit<typeof APPWRITE, "DB">
    value?: string | number
    name?: string
    queries?: string[]
    map?: (document: Models.DefaultRow) => { value: string, label: string }
    required?: boolean
  } = $props()

  let data = $state<Models.DefaultRow[]>([])
  const options = $derived(data.map(map))

  onMount(async () => {
    const result = await page.data.aw.db.listRows({
      databaseId: APPWRITE.DB,
      tableId: APPWRITE[table],
      queries: [
        Query.limit(9999),
        ...queries ?? []
      ]
    })
    data = result.rows
  })
</script>

<Combobox {name} {options} {required} bind:value/>