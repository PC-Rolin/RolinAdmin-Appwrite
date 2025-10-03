<script lang="ts">
  // noinspection ES6UnusedImports
  import { Card } from "$lib/components/ui";
  import type { Component } from "svelte";
  import { Package } from "@lucide/svelte";

  const links: { href: string, title: string, img?: string | Component }[] = [
    {
      href: "https://pcrolin-my.sharepoint.com/:x:/g/personal/info_pcrolin_nl/Eb65Y_wGK-NBqbMcyOdXrscBnv3ujKvy7kRWYqdjj9FQfg?e=iXUuG4",
      title: "Backup Document",
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

<Card.Root class="bg-background">
  <Card.Header>
    <Card.Title>Snelle Links</Card.Title>
  </Card.Header>
  <Card.Content class="grid grid-cols-6 gap-4">
    {#each links as link (link.href)}
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
  </Card.Content>
</Card.Root>