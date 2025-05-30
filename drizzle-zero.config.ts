import { drizzleZeroConfig } from 'drizzle-zero'
import * as drizzleSchema from './src/payload-generated-schema'

// Define your configuration file for the CLI
export default drizzleZeroConfig(drizzleSchema, {
  // Specify which tables and columns to include in the Zero schema.
  // This allows for the "expand/migrate/contract" pattern recommended in the Zero docs.
  // When a column is first added, it should be set to false, and then changed to true
  // once the migration has been run.

  // All tables/columns must be defined, but can be set to false to exclude them from the Zero schema.
  // Column names match your Drizzle schema definitions
  tables: {
    // this can be set to false
    // e.g. user: false,
    users: {
      id: true,
      username: true,
      name: true,
      first_name: true,
      last_name: true,
      position: true,
      image: true,
      members: true,
    },
    media: true,
    pipelines: true,
    stages: true,
    tasks: true,
  },

  // Specify the casing style to use for the schema.
  // This is useful for when you want to use a different casing style than the default.
  // This works in the same way as the `casing` option in the Drizzle ORM.
  //
  // @example
  // casing: "snake_case",
})
