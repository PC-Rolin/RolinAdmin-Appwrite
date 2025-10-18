<script lang="ts">
  // noinspection ES6UnusedImports
  import { Card, Avatar, Input } from "$lib/components/ui";
  import { type Component, onMount } from "svelte";
  import { Package, Phone, BellRing } from "@lucide/svelte";
  import { list, updateAgent, updateName } from "$lib/remote/duties.remote";
  import * as users from "$lib/remote/users.remote"
  import { Select } from "$lib/components/form";
  import { AppwriteException, type Models, type RealtimeResponseEvent } from "appwrite";
  import { toast } from "svelte-sonner";
  import { isHttpError } from "@sveltejs/kit";
  import type { Duty } from "$lib/appwrite/types";

  let { data } = $props()

  let duties = $state(await list())
  const profiles = await users.list()

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

  onMount(() => {
    function isUpdateResponse(response: RealtimeResponseEvent<unknown>): response is RealtimeResponseEvent<Duty & Models.Row> {
      return response.events.includes("databases.*.tables.*.rows.*.update")
    }

    data.realtime.subscribe("databases.rolinadmin.tables.duties.rows", async response => {
      await users.list().refresh()
      if (isUpdateResponse(response)) {
        const index = duties.findIndex(duty => duty.$id === response.payload.$id)
        duties[index] = response.payload
      }
    })
  })

  async function onNameChange(event: Event) {
    event.preventDefault()
    const target = event.target as HTMLInputElement
    const id = target.getAttribute("data-id")!
    try {
      await updateName({ id, name: target.value })
      toast.success("Naam aangepast")
    } catch (error) {
      if (error instanceof AppwriteException) {
        toast.error(error.message)
      } else if (isHttpError(error)) {
        toast.error(error.body.message)
      } else {
        toast.error("Er is een onbekende fout opgetreden")
      }
      duties = await list()
    }
  }

  async function onAgentChange(duty: string, agent: string) {
    try {
      await updateAgent({ id: duty, agent })
      toast.success("Agent aangepast")
    } catch (error) {
      if (error instanceof AppwriteException) {
        toast.error(error.message)
      } else if (isHttpError(error)) {
        toast.error(error.body.message)
      } else {
        toast.error("Er is een onbekende fout opgetreden")
      }
      duties = await list()
    }
  }
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

  <div class="flex gap-4">
    <Card.Root class="w-fit">
      <Card.Header>
        <Card.Title>Voorraad</Card.Title>
      </Card.Header>
      <Card.Content>
        <iframe title="Voorraad" width="621" height="170" src="https://pcrolin-my.sharepoint.com/personal/info_pcrolin_nl/_layouts/15/Doc.aspx?sourcedoc={'{c9f86c31-ea5b-45ed-a47e-c44875f9e558}'}&action=embedview&wdAllowInteractivity=False&Item=Tabel2&wdHideGridlines=True&wdDownloadButton=True&wdInConfigurator=True&wdInConfigurator=True"></iframe>
      </Card.Content>
    </Card.Root>
    <Card.Root class="w-full">
      <Card.Header>
        <Card.Title class="flex items-center gap-2 text-lg font-medium">
          <Phone/>
          Telefoondiensten
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <div class="grid grid-cols-2 items-center gap-2 mt-2">
          {#key duties}
            {#each duties.slice(0, 3) as duty (duty.$id)}
              {@const profile = profiles.find(profile => profile.$id === duty.agent)}
              {#if data.user?.labels.includes("admin")}
                <Input data-id={duty.$id} value={duty.name} onchange={onNameChange}/>
              {:else}
                <span class="font-medium">1e PC Rolin'</span>
              {/if}
              <div class="flex items-center gap-2">
                {#if profile}
                  <Avatar.Root class="size-8">
                    <Avatar.Image src={data.aw.avatars.getInitials({ name: profile.name })} class="object-cover"/>
                    <Avatar.Fallback>{profile.name.split(' ').map(v => v[0]).join('')}</Avatar.Fallback>
                  </Avatar.Root>
                {/if}
                {#if data.user?.labels.includes("admin")}
                  <Select options={profiles.map(profile => {
                    return {
                      label: profile.name,
                      value: profile.$id
                    }
                  })} value={duty.agent} onValueChange={async value => {
                    await onAgentChange(duty.$id, value)
                  }}/>
                {:else}
                  <span>{profile?.name}</span>
                {/if}
              </div>
            {/each}
          {/key}
        </div>
      </Card.Content>
    </Card.Root>
    <Card.Root class="w-full">
      <Card.Header>
        <Card.Title class="flex items-center gap-2 text-lg font-medium">
          <BellRing/>
          Andere diensten
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <div class="grid grid-cols-2 items-center gap-2 mt-2">
          {#key duties}
            {#each duties.slice(3, 7) as duty (duty.$id)}
              {@const profile = profiles.find(profile => profile.$id === duty.agent)}
              {#if data.user?.labels.includes("admin")}
                <Input data-id={duty.$id} value={duty.name} onchange={onNameChange}/>
              {:else}
                <span class="font-medium">{duty.name}</span>
              {/if}
              <div class="flex items-center gap-2">
                {#if profile}
                  <Avatar.Root class="size-8">
                    <Avatar.Image src={data.aw.avatars.getInitials({ name: profile.name })} class="object-cover"/>
                    <Avatar.Fallback>{profile.name.split(' ').map(v => v[0]).join('')}</Avatar.Fallback>
                  </Avatar.Root>
                {/if}
                {#if data.user?.labels.includes("admin")}
                  <Select options={profiles.map(profile => {
                    return {
                      label: profile.name,
                      value: profile.$id
                    }
                  })} value={duty.agent} onValueChange={async value => {
                    await onAgentChange(duty.$id, value)
                  }}/>
                {:else}
                  <span>{profile?.name}</span>
                {/if}
              </div>
            {/each}
          {/key}
        </div>
      </Card.Content>
    </Card.Root>
  </div>
</div>