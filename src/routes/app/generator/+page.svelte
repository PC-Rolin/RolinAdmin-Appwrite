<script lang="ts">
  // noinspection ES6UnusedImports
  import { Card } from "$lib/components/ui"
  import OfficeGenerator from "./OfficeGenerator.svelte"
  import { generatePassword } from "$lib/remote/generator.remote"
</script>

<OfficeGenerator result={async customer => {
  return {
    bitwarden: `${customer.wticket} - Office - ${customer.name}`,
    email: `${customer.name.split(' ').join('').split('.').join('').toLowerCase()}${customer.wticket}@outlook.com`,
    password: await generatePassword()
  }
}}>
  {#snippet data(result)}
    <p class="mb-4">
      Sla deze gegevens op in Bitwarden als volgt:
      <span class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">{result.bitwarden}</span>
    </p>
    <Card.Root>
      <Card.Content class="grid grid-cols-2">
        <strong>Email</strong>
        <span>{result.email}</span>
        <strong>Wachtwoord</strong>
        <span>{result.password}</span>
      </Card.Content>
    </Card.Root>
  {/snippet}
</OfficeGenerator>