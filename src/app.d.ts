import type { Account, Models, TablesDB } from "appwrite";

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
	}
}