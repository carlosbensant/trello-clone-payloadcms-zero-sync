# Trello Clone using PayloadCMS and Zero Sync

Since both PayloadCMS and Zero are betting on the Drizzle, I didn't need much to make it work.

- **PayloadCMS generates the Drizzle schema built-in.** You can even customize the file output generateSchemaOutputFile.
- You can easily use **drizzle-zero** to generate the Zero Schema from the (Payload generated) Drizzle Schema.
- You just have to import the schema, add permissions, and the rest is history.

## Run the project
1. `yarn dev`

2. `yarn run generate:everything`. Once the DB has been updated, we need to generate the PayloadCMS import:maps, the PayloadCMS schema and the Drizzle-zero schema, and to update the PayloadCMS types.

Yes, it is that easy. Remember, **Zero Sync is still in alpha**. Many people use it in production, but they do so at their own risk. Also, the Drizzle-zero package is still a work in progress and may contain bugs.
