<script lang="ts">
  // noinspection ES6UnusedImports
  import { Sidebar, Separator, Breadcrumb } from "$lib/components/ui"
  import { page } from "$app/state";

  let { data, children } = $props()
</script>

<Sidebar.Provider>
  <Sidebar.Root collapsible="icon">
    <Sidebar.Header class="p-3">
      <img src="/logo.png" alt="Logo">
    </Sidebar.Header>
    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            {#each data.sidebar.items as item}
              <Sidebar.MenuItem>
                <Sidebar.MenuButton>
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
                <Sidebar.MenuButton>
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