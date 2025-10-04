import { Client, TablesDB, Query } from 'node-appwrite';

// noinspection JSUnusedGlobalSymbols
/** @param {import("../../types").Context} context */
export default async context => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(context.req.headers["x-appwrite-key"])
  ;

  const db = new TablesDB(client)

  const user = /** @type {import("node-appwrite").Models.User<Preferences>} */ context.req.bodyJson

  await db.updateRows({
    databaseId: "rolinadmin",
    tableId: "daily",
    data: {
      agent: null
    },
    queries: [Query.equal("agent", user.$id)]
  })

  await db.updateRows({
    databaseId: "rolinadmin",
    tableId: "daily",
    data: {
      completedBy: null
    },
    queries: [Query.equal("completedBy", user.$id)]
  })

  return context.res.empty()
}