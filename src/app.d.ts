import type { Account, Avatars, Client, Models, TablesDB } from "appwrite";
import type { Breadcrumb } from "$lib/types";
import type { Realtime } from "$lib/appwrite/realtime";

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
				db: TablesDB
			}
			breadcrumbs: Breadcrumb[]
			realtime: Realtime
		}
	}
}