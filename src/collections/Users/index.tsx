import type { CollectionConfig } from 'payload'
import { isSuperAdminFieldAccess } from './access/isSuperAdmin'
import { readAccess } from './access/read'
import { updateAccess } from './access/update'

// Fields
export const UserFields: CollectionConfig['fields'] = [
  // This is the sub field that will be used for JWT compatibility with Zero
  {
    name: 'sub',
    type: 'text',
    saveToJWT: true,
    admin: {
      hidden: true, // Hide from admin interface since it's auto-generated
    },
  },
  {
    name: 'username',
    type: 'text',
    required: true,
    unique: true,
    index: true,
  },
  {
    name: 'name',
    type: 'text',
    defaultValue: '',
    required: true,
  },
  {
    label: 'First name',
    name: 'first_name',
    type: 'text',
    defaultValue: '',
    required: true,
  },
  {
    label: 'Last name',
    name: 'last_name',
    type: 'text',
    defaultValue: '',
    required: true,
  },
  {
    name: 'position',
    type: 'text',
  },
  {
    name: 'image',
    type: 'upload',
    relationTo: 'media',
    admin: {
      components: {
        Cell: 'src/custom-fields/Thumbnail/Component.tsx',
      },
    },
  },
  {
    name: 'description',
    type: 'richText',
  },
  {
    name: 'mobile',
    type: 'text',
  },
  {
    name: 'phone',
    type: 'text',
  },
  {
    type: 'select',
    name: 'gender',
    options: [
      {
        label: 'Male',
        value: 'male',
      },
      {
        label: 'Female',
        value: 'female',
      },
    ],
  },
  {
    name: 'roles',
    type: 'select',
    hasMany: true,
    saveToJWT: true,
    hooks: {
      beforeChange: [],
    },
    defaultValue: ['user'],
    options: [
      {
        label: 'admin',
        value: 'admin',
      },
      {
        label: 'user',
        value: 'user',
      },
    ],
    required: true,
    access: {
      update: isSuperAdminFieldAccess,
    },
    index: true,
  },
  {
    label: 'Pipelines',
    name: 'Pipelines',
    type: 'join',
    collection: 'pipelines',
    on: 'members',
  },
]

const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email'],
  },
  access: {
    read: readAccess,
    // create: anyone,
    update: updateAccess,
    // delete: admins,
    // admin: ({ req: { user } }) => checkRole(['admin'], user),
  },
  auth: {
    tokenExpiration: 28800, // 8 hours
    cookies: {
      secure: true,
      domain: process.env.PAYLOAD_PUBLIC_SITE_DOMAIN,
      sameSite: 'Lax',
    },
  },
  hooks: {
    afterChange: [
      async ({ req, doc, operation }) => {
        // Ensure sub field is set to user's ID for JWT compatibility with Zero
        if (operation === 'create' && doc && doc.id) {
          console.log(`Adding sub property with user ${doc.id}`)
          await req.payload.update({
            collection: 'users',
            id: doc.id,
            data: {
              sub: doc.id, // Ensure sub is set to the user
            },
            req,
          })
        }
        return doc
      },
    ],
  },
  fields: UserFields,
  timestamps: true,
}

export default Users
