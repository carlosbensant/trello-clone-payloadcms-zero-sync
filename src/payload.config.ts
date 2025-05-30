// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import Users from './collections/Users'
import { Media } from './collections/Media'

// Pipeline Management
import { Pipelines } from './collections/Pipelines'
import { Stages } from './collections/Stages'
import { Tasks } from './collections/Tasks'

import { seed } from './seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  debug: process.env.NODE_ENV !== 'production',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,

    // Pipeline
    Pipelines,
    Stages,
    Tasks,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    allowIDOnCreate: true,
    idType: 'uuid',
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  async onInit(payload) {
    await seed(payload)
  },
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
