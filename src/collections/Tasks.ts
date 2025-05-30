import type { CollectionConfig } from 'payload'

export const Tasks: CollectionConfig = {
  slug: 'tasks',
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
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'stage',
      type: 'relationship',
      relationTo: 'stages',
      required: true,
    },
    {
      name: 'position',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'assignee',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
    },
    {
      name: 'observers',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'dueDate',
      type: 'date',
    },
    {
      name: 'labels',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'color',
          type: 'text',
          defaultValue: '#61bd4f',
        },
      ],
    },
  ],
}
