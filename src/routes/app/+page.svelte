<script lang="ts">
  // noinspection ES6UnusedImports
  import { Card } from "$lib/components/ui";
  import type { Component } from "svelte";
  import { Package } from "@lucide/svelte";

  const links: { href: string, title: string, img?: string | Component }[] = [
    {
      href: "https://pcrolin-my.sharepoint.com/:x:/g/personal/info_pcrolin_nl/Eb65Y_wGK-NBqbMcyOdXrscBnv3ujKvy7kRWYqdjj9FQfg",
      title: "Backup Document",
      img: "https://res.public.onecdn.static.microsoft/officeonline/x/s/h63BD80475830AA69__layouts/resources/FavIcon_Excel.ico"
    },
    {
      href: "https://pcrolin-my.sharepoint.com/:x:/g/personal/info_pcrolin_nl/ETFs-Mlb6u1FpH7ESHX55VgBHFXeq43PkYyRWEC7DLba4A",
      title: "Voorraad Document",
      img: "https://res.public.onecdn.static.microsoft/officeonline/x/s/h63BD80475830AA69__layouts/resources/FavIcon_Excel.ico"
    },
    {
      href: "https://portal.pcrolin.nl",
      title: "RolinPortal",
      img: Package
    },
    {
      href: "https://leren.pcrolin.nl",
      title: "Moodle",
      img: "https://moodle.org/theme/moodleorg/pix/moodle_logo_TM.svg"
    },
    {
      href: "https://gofile.me/4nFVx/xifXujXWI",
      title: "RolinAutomator"
    },
    {
      href: "https://gofile.me/4nFVx/LM591jmJk",
      title: "RolinCheck"
    },
    {
      href: "https://gofile.me/4nFVx/aDjzCF1YT",
      title: "RolinClean"
    }
  ]
</script>

<div class="grid gap-4">
  <Card.Root class="bg-background">
    <Card.Header>
      <Card.Title>Snelle Links</Card.Title>
    </Card.Header>
    <Card.Content class="flex flex-col gap-4">
      <div class="grid grid-cols-7 gap-4">
        {#each links as link (link.href)}
          <!-- eslint-disable-next-line -->
          <a href={link.href} target="_blank">
            <Card.Root class="h-full">
              <Card.Content class="flex h-full flex-col items-center gap-4 py-4">
                {#if link.img}
                  {#if typeof link.img === "string"}
                    <img src={link.img} alt="" class="size-12">
                  {:else}
                    {@const IMG = link.img}
                    <IMG class="size-12"/>
                  {/if}
                {/if}
                <p class="font-medium my-auto">{link.title}</p>
              </Card.Content>
            </Card.Root>
          </a>
        {/each}
      </div>
      <div>
        <h4 class="text-lg font-medium">RolinPortal voor Klanten</h4>
        <a href="https://portal.pcrolin.nl/overstap?ticket=" target="_blank" class="text-blue-400 hover:underline">https://portal.pcrolin.nl/overstap?ticket=</a>
      </div>
    </Card.Content>
  </Card.Root>

  <Card.Root class="w-fit">
    <Card.Header>
      <Card.Title>Voorraad</Card.Title>
    </Card.Header>
    <Card.Content>
      <iframe title="Voorraad" width="621" height="170" src="https://pcrolin-my.sharepoint.com/personal/info_pcrolin_nl/_layouts/15/Doc.aspx?sourcedoc={'{c9f86c31-ea5b-45ed-a47e-c44875f9e558}'}&action=embedview&wdAllowInteractivity=False&Item=Tabel2&wdHideGridlines=True&wdDownloadButton=True&wdInConfigurator=True&wdInConfigurator=True"></iframe>
    </Card.Content>
  </Card.Root>
</div>