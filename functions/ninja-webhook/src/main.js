// noinspection JSUnusedGlobalSymbols
/** @param {import("../../types").Context} context */
export default async context => {
  context.log("Ninja webhook received")
  context.log(JSON.stringify(context.req.bodyJson))

  return context.res.empty()
}