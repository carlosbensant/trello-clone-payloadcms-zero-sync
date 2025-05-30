import type { CollectionConfig } from 'payload'

export const Stages: CollectionConfig = {
  slug: 'stages',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'pipeline',
      type: 'relationship',
      relationTo: 'pipelines',
      required: true,
    },
    {
      name: 'position',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
  ],
}
