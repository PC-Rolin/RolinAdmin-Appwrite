import { Client, Users } from 'node-appwrite';

// noinspection JSUnusedGlobalSymbols
/** @param {import("../../types").Context} context */
export default async context => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(context.req.headers["x-appwrite-key"])
  ;

  const services = {
    users: new Users(client)
  }

  const user = context.req.bodyJson

  context.log(JSON.stringify(user))
}