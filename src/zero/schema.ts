import { type Row, definePermissions, ANYONE_CAN_DO_ANYTHING } from '@rocicorp/zero'

import { schema, type Schema } from '../../zero-schema.gen'
export { schema, type Schema }

export type User = Row<typeof schema.tables.users>

export const permissions = definePermissions<{}, Schema>(schema, () => ({
  users: ANYONE_CAN_DO_ANYTHING,
  media: ANYONE_CAN_DO_ANYTHING,
  pipelines: ANYONE_CAN_DO_ANYTHING,
  stages: ANYONE_CAN_DO_ANYTHING,
  tasks: ANYONE_CAN_DO_ANYTHING,
}))
