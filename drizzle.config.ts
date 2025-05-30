import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/drizzle/migrations/schema.ts',
  out: './src/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URI || 'postgres://user:master@localhost:5432/mana',
  },
  introspect: {
    casing: 'camel',
  },
})
