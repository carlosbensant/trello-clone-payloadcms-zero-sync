import type { Access, Where } from 'payload'

import { isSuperAdmin } from './isSuperAdmin'

const adminsAndUser: Access = async ({ req }) => {
  const user = req.user
  if (!user) {
    return false
  }

  if (isSuperAdmin(user)) {
    return true
  }

  // if (checkRole(['admin'], user)) {
  //   return true
  // }

  return {
    or: [
      {
        id: {
          equals: user.id,
        },
      },
    ],
  } as Where
}

export default adminsAndUser
