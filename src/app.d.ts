import type { Client, Account, Avatars, Models, TablesDB } from "appwrite";
import type { Breadcrumb } from "$lib/types";
import type { Pathname } from "$app/types";
import type { Component } from "svelte";

declare global {
	type Preferences = {
		dark: boolean | "true" | "false" | undefined
	}

	namespace App {
		interface Locals {
			user: Models.User<Preferences> | undefined
			account: Account
			db: TablesDB
		}
		interface PageData {
			user: Models.User<Preferences> | undefined
			aw: {
				client: Client
				avatars: Avatars
			}
			breadcrumbs: Breadcrumb[]
			sidebar?: {
				items: {
					label: string
					href: Pathname
					icon: Component
				}[]
				admin: {
					label: string
					href: Pathname
					icon: Component
				}[]
			}
		}
	}
}