import type { LayoutLoad } from "./$types";
import {
  BadgePercent,
  Calculator,
  LayoutDashboard,
  LayoutList,
  Logs,
  RedoDot,
  Server,
  ShieldUser,
  Users
} from "@lucide/svelte";

export const load: LayoutLoad = async ({ parent }) => {
  const { breadcrumbs } = await parent()

  return {
    breadcrumbs: breadcrumbs.concat({ label: "Dashboard", href: "/app" }),
    sidebar: {
      items: [
        {
          label: "Dashboard",
          href: "/app",
          icon: LayoutDashboard
        },
        {
          label: "Daily",
          href: "/app/daily",
          icon: LayoutList
        },
        {
          label: "Overstaps",
          href: "/app/overstaps",
          icon: RedoDot
        },
        {
          label: "Prijslijst",
          href: "/app/prijslijst",
          icon: BadgePercent
        },
        {
          label: "Klanten",
          href: "/app/klanten",
          icon: Users
        },
        {
          label: "Generator",
          href: "/app/generator",
          icon: Calculator
        },
        {
          label: "NAS",
          href: "/app/nas",
          icon: Server
        }
      ],
      admin: [
        {
          label: "Logs",
          href: "/app/admin/logs",
          icon: Logs
        },
        {
          label: "Gebruikers",
          href: "/app/admin/users",
          icon: ShieldUser
        }
      ]
    }
  }
}