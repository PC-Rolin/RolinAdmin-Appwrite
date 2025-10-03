import { WTicketBot } from "wticket-bot"
import { WTicketAPI } from "wticket-api"
import { env } from "$env/dynamic/private"

export const api = new WTicketAPI({
  url: env.WTICKET_URL,
  username: env.WTICKET_USERNAME,
  password: env.WTICKET_PASSWORD
})

export const bot = new WTicketBot({
  host: "wticket-pcrolin.multitrader.nl"
})