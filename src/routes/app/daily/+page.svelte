<script lang="ts">
  import * as daily from "$lib/remote/daily.remote"

  let tickets = $state(await daily.list())
  $inspect(tickets)
</script>

<div class="flex gap-2">

</div>