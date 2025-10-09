import { WTicketBot } from "wticket-bot"
import { WTicketAPI } from "wticket-api"
import { WTICKET_PASSWORD, WTICKET_USERNAME, WTICKET_URL } from "$env/static/private"

export const api = new WTicketAPI({
  url: WTICKET_URL,
  username: WTICKET_USERNAME,
  password: WTICKET_PASSWORD
})

export const bot = new WTicketBot({
  host: "wticket-pcrolin.multitrader.nl"
})