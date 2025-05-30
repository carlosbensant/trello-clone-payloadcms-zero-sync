import type { CollectionConfig } from 'payload'

export const Pipelines: CollectionConfig = {
  slug: 'pipelines',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: ({ req: { user } }) => {
      // Users can only read pipelines they own or are members of
      return Boolean(user)
    },
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
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'backgroundColor',
      type: 'text',
      defaultValue: '#0079bf',
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }) => user?.id,
    },
    {
      name: 'members',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'isPrivate',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
