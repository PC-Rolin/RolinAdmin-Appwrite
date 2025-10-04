<script lang="ts">
	import '../app.css'
  import { onMount } from "svelte";
  import { invalidateAll } from "$app/navigation";
  import type { RealtimeResponseEvent } from "appwrite";

	let { data, children } = $props()

  onMount(() => {
    function isPreferencesResponse(response: RealtimeResponseEvent<unknown>): response is RealtimeResponseEvent<Preferences> {
      return response.events.includes("users.*.update.prefs")
    }

    const unsubscribe = data.realtime.subscribe("account", payload => {
      if (isPreferencesResponse(payload)) {
        const html = document.getElementsByTagName("html")[0]
        const dark = payload.payload.dark === "true"
        html.setAttribute("class", dark ? "dark" : '')
      }
      invalidateAll()
    })

    return () => unsubscribe()
  })
</script>

{@render children()}