import type { Client, RealtimeResponseEvent } from "appwrite";

export class Realtime {
  private client: Client;
  private subscriptions: Record<string, (payload: RealtimeResponseEvent<unknown>) => void> = {}
  private subscription: (() => void) | undefined

  constructor(client: Client) {
    this.client = client;
  }

  private refresh() {
    if (this.subscription) this.subscription()
    this.subscription = this.client.subscribe(Object.keys(this.subscriptions), payload => {
      for (const channel in this.subscriptions) {
        if (payload.channels.includes(channel)) {
          this.subscriptions[channel](payload)
        }
      }
    })
  }

  subscribe(channel: string, callback: (payload: RealtimeResponseEvent<unknown>) => void) {
    this.subscriptions[channel] = callback
    this.refresh()
    return () => this.unsubscribe(channel)
  }

  unsubscribe(channel: string) {
    delete this.subscriptions[channel]
    this.refresh()
  }
}