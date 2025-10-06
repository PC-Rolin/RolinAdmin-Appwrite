import type { Models } from "appwrite";
import type { SharedClient } from "appwrite-sveltekit";

declare global {
	type Preferences = {
		dark: boolean | "true" | "false" | undefined
	}

	type Functions = ["68e16fd60036d3ea345e", "68dfe9e100316ecad56f"]

	type Buckets = []

	type Databases = {
		rolinadmin: {
			customers: {
				wticket: number
				name: string
				type: "Particulier" | "Zakelijk"
				street: string | null
				houseNumber: string | null
				ninjaOrganization: number | null
				snelstartId: number | null
				postalCode: string | null
				invoiceEmail: string | null
				wantsInvoice: boolean | null
				invoiceInterval: "Maand" | "Kwartaal" | "Jaar" | null
				invoiceIncasso: boolean | null
				city: string | null
				notes: string | null
				hasOffice: boolean | null
			}
			daily: {
				ticket: number
				agent: string | null
				completedBy: string | null
				prio: number | null
				status: string | null
			}
			systems: {
				ninja: number
				package: number
				hasSyncback: boolean | null
				contactPerson: string | null
			}
		}
	}

	namespace App {
		interface Locals {
			user: Models.User<Preferences> | undefined
			appwrite: SharedClient<{
				Preferences: Preferences
				Functions: Functions
				Buckets: Buckets
				Databases: Databases
			}>
		}
	}
}