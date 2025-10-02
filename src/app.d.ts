import type { Account, Client, Models, TablesDB } from "appwrite";

declare global {
	type Preferences = {}

	namespace App {
		interface Locals {
			user: Models.User<Preferences> | undefined
			account: Account
			db: TablesDB
		}
		interface PageData {
			aw: {
				client: Client
			}
		}
	}
}