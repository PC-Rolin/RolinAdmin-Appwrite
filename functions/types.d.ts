export type Context = {
  req: {
    bodyText: string
    bodyJson: Record<string, any>
    headers: {
      "x-appwrite-trigger": "http" | "schedule" | "event"
      "x-appwrite-event": string
      "x-appwrite-key": string
      "x-appwrite-user-id"?: string
      "x-appwrite-user-jwt"?: string
      "x-appwrite-country-code"?: string
      "x-appwrite-continent-code"?: string
      "x-appwrite-continent-eu"?: string
      "x-appwrite-client-ip"?: string
      "x-appwrite-execution-id": string
    } & Record<string, string>
    scheme: string
    method: string
    url: string
    host: string
    port: string
    path: string
    queryString: string
    query: Record<string, string>
  }
  res: {
    /** Sends a response with code `204 No Content` status. */
    empty(): any
    /** Converts the data into a JSON string and sets the content-type header to application/json. */
    json(data: any): any
    /** Packages binary bytes, the status code, and the headers into an object. */
    binary(data: any): any
    /** Redirects the client to the specified URL link. */
    redirect(url: string, code: number): any
    /** Converts the body using UTF-8 encoding into a binary Buffer. */
    text(data: string, code: number): any
  }
  log: (message: string) => void
  error: (message: string) => void
}