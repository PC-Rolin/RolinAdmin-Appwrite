import { Client, TablesDB, Query } from "node-appwrite";

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

  const transaction = await db.createTransaction()

  await db.updateRows({
    databaseId: "rolinadmin",
    tableId: "daily",
    data: {
      agent: null
    },
    queries: [Query.equal("agent", user.$id)],
    transactionId: transaction.$id
  })

  await db.updateRows({
    databaseId: "rolinadmin",
    tableId: "daily",
    data: {
      completedBy: null
    },
    queries: [Query.equal("completedBy", user.$id)],
    transactionId: transaction.$id
  })

  await db.updateRows({
    databaseId: "rolinadmin",
    tableId: "duties",
    data: {
      agent: null
    },
    queries: [Query.equal("agent", user.$id)],
    transactionId: transaction.$id
  })

  await db.updateTransaction({
    transactionId: transaction.$id,
    commit: true
  })

  return context.res.empty()
}