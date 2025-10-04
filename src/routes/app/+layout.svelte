<script lang="ts">
  // noinspection ES6UnusedImports
  import { Sidebar, Separator, Breadcrumb, DropdownMenu, Avatar } from "$lib/components/ui"
  import { page } from "$app/state"
  import type { Models } from "appwrite"
  import { ChevronsUpDown, BadgeCheck, LogOut } from "@lucide/svelte";

  let { data, children } = $props()

  const sidebar = Sidebar.useSidebar()

  let open = $state(true)
</script>

{#snippet User(user: Models.User<Preferences>)}
  <Avatar.Root class="size-8 rounded-lg">
    <Avatar.Image src={data.aw.avatars.getInitials({ name: user.name })}/>
    <Avatar.Fallback>{user.name.split(' ').map(v => v[0]).join('')}</Avatar.Fallback>
  </Avatar.Root>
  <div class="grid flex-1 text-left text-sm leading-tight">
    <span class="truncate font-semibold">{user.name}</span>
    <span class="truncate text-xs">{user.email}</span>
  </div>
{/snippet}

<Sidebar.Provider class="h-full" bind:open>
  <Sidebar.Root collapsible="icon">
    {#if open}
      <Sidebar.Header class="p-3">
        <img src="/logo.png" alt="Logo">
      </Sidebar.Header>
    {/if}
    {#if data.user}
      <Sidebar.Content>
        <Sidebar.Group>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              {#each data.sidebar.items as item}
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton isActive={item.href === page.url.pathname}>
                    {#snippet child({ props })}
                      {@const Icon = item.icon}
                      <a {...props} href={item.href}>
                        <Icon/>
                        <span>{item.label}</span>
                      </a>
                    {/snippet}
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              {/each}
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>
        <Sidebar.Group class="mt-auto">
          <Sidebar.GroupLabel>Admin</Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              {#each data.sidebar.admin as item}
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton isActive={item.href === page.url.pathname}>
                    {#snippet child({ props })}
                      {@const Icon = item.icon}
                      <a {...props} href={item.href}>
                        <Icon/>
                        <span>{item.label}</span>
                      </a>
                    {/snippet}
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              {/each}
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>
      </Sidebar.Content>
      <Sidebar.Footer>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                {#snippet child({ props })}
                  {#if data.user}
                    <Sidebar.MenuButton {...props} size="lg" class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                      {@render User(data.user)}
                      <ChevronsUpDown class="ml-auto"/>
                    </Sidebar.MenuButton>
                  {/if}
                {/snippet}
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                side={sidebar?.isMobile ? "bottom" : "right"}
                class="w-[var(--bits-dropdown-menu-anchor-width)] min-w-56 rounded-lg"
                align="end"
                sideOffset={4}
              >
                <DropdownMenu.Label class="p-0 font-normal">
                  <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    {@render User(data.user)}
                  </div>
                </DropdownMenu.Label>
                <DropdownMenu.Separator/>
                <DropdownMenu.Group>
                  <DropdownMenu.Item>
                    {#snippet child({ props })}
                      <a {...props} href="/app/account">
                        <BadgeCheck/>
                        <span>Account</span>
                      </a>
                    {/snippet}
                  </DropdownMenu.Item>
                </DropdownMenu.Group>
                <DropdownMenu.Separator/>
                <DropdownMenu.Item>
                  {#snippet child({ props })}
                    <a {...props} data-sveltekit-preload-data="false" href="/auth/logout">
                      <LogOut class="text-red-500"/>
                      <span class="text-red-500">Uitloggen</span>
                    </a>
                  {/snippet}
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Footer>
    {/if}
  </Sidebar.Root>
  <Sidebar.Inset>
    <header class="flex h-16 shrink-0 items-center gap-2 border-b">
      <div class="flex items-center gap-2 px-3">
        <Sidebar.Trigger />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <Breadcrumb.Root>
          <Breadcrumb.List>
            {#each page.data.breadcrumbs as breadcrumb, i}
              {#if breadcrumb.href === page.url.pathname}
                <Breadcrumb.Item>
                  <Breadcrumb.Page>{breadcrumb.label}</Breadcrumb.Page>
                </Breadcrumb.Item>
              {:else}
                <Breadcrumb.Item>
                  <Breadcrumb.Link href={breadcrumb.href}>{breadcrumb.label}</Breadcrumb.Link>
                </Breadcrumb.Item>
                {#if i < page.data.breadcrumbs.length - 1}
                  <Breadcrumb.Separator/>
                {/if}
              {/if}
            {/each}
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </div>
    </header>
    <div class="p-4 overflow-y-auto">
      {@render children()}
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>