import { type Client, type Models, TablesDB } from "appwrite";

declare global {
	namespace App {
		interface Locals {
			user: Models.User | undefined
			db: TablesDB
		}
		interface PageData {
			aw: {
				client: Client
			}
		}
	}
}