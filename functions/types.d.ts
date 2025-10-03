export type Context = {
  req: any
  res: any
  log: (message: string) => void
  error: (message: string) => void
}