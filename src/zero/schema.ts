import {
  definePermissions,
  ANYONE_CAN_DO_ANYTHING,
  createSchema,
  table,
  string,
  boolean,
  number,
  json,
  enumeration,
  relationships,
} from '@rocicorp/zero'

// Define enums based on the Drizzle schema
export type UserRole = 'admin' | 'user'
export type UserGender = 'male' | 'female'

// Define tables
export const users = table('users')
  .columns({
    id: string(),
    sub: string().optional(),
    username: string(),
    name: string(),
    first_name: string().from('first_name'),
    last_name: string().from('last_name'),
    position: string().optional(),
    image: string().optional().from('image_id'), // references media.id
    description: json<any>().optional(),
    mobile: string().optional(),
    phone: string().optional(),
    gender: enumeration<UserGender>().optional(),
    updatedAt: number().from('updated_at'),
    createdAt: number().from('created_at'),
    email: string(),
    resetPasswordToken: string().optional().from('reset_password_token'),
    resetPasswordExpiration: number().optional().from('reset_password_expiration'),
    salt: string().optional(),
    hash: string().optional(),
    loginAttempts: number().from('login_attempts'),
    lockUntil: number().optional().from('lock_until'),
  })
  .primaryKey('id')

export const users_roles = table('users_roles')
  .columns({
    id: string(),
    order: number(),
    parent: string().from('parent_id'), // references users.id
    value: enumeration<UserRole>().optional(),
  })
  .primaryKey('id')

export const media = table('media')
  .columns({
    id: string(),
    alt: string(),
    updatedAt: number().from('updated_at'),
    createdAt: number().from('created_at'),
    url: string().optional(),
    thumbnailURL: string().optional().from('thumbnail_u_r_l'),
    filename: string().optional(),
    mimeType: string().optional().from('mime_type'),
    filesize: number().optional(),
    width: number().optional(),
    height: number().optional(),
    focalX: number().optional().from('focal_x'),
    focalY: number().optional().from('focal_y'),
  })
  .primaryKey('id')

export const pipelines = table('pipelines')
  .columns({
    id: string(),
    title: string(),
    description: string().optional(),
    backgroundColor: string().from('background_color'),
    owner: string().from('owner_id'), // references users.id
    isPrivate: boolean().from('is_private'),
    updatedAt: number().from('updated_at'),
    createdAt: number().from('created_at'),
  })
  .primaryKey('id')

export const pipelines_rels = table('pipelines_rels')
  .columns({
    id: number(),
    order: number().optional(),
    parent: string().from('parent_id'), // references pipelines.id
    path: string(),
    usersID: string().optional().from('users_id'), // references users.id
  })
  .primaryKey('id')

export const stages = table('stages')
  .columns({
    id: string(),
    title: string(),
    pipeline: string().from('pipeline_id'), // references pipelines.id
    position: number(),
    updatedAt: number().from('updated_at'),
    createdAt: number().from('created_at'),
  })
  .primaryKey('id')

export const tasks = table('tasks')
  .columns({
    id: string(),
    title: string(),
    description: string().optional(),
    stage: string().from('stage_id'), // references stages.id
    position: number(),
    assignee: string().optional().from('assignee_id'), // references users.id
    dueDate: number().optional().from('due_date'),
    updatedAt: number().from('updated_at'),
    createdAt: number().from('created_at'),
  })
  .primaryKey('id')

export const tasks_labels = table('tasks_labels')
  .columns({
    id: string(),
    _order: number().from('_order'),
    _parentID: string().from('_parent_id'), // references tasks.id
    name: string().optional(),
    color: string(),
  })
  .primaryKey('id')

export const tasks_rels = table('tasks_rels')
  .columns({
    id: number(),
    order: number().optional(),
    parent: string().from('parent_id'), // references tasks.id
    path: string(),
    usersID: string().optional().from('users_id'), // references users.id
  })
  .primaryKey('id')

// Define relationships
export const usersRelationships = relationships(users, ({ one, many }) => ({
  profileImage: one({
    sourceField: ['image'],
    destSchema: media,
    destField: ['id'],
  }),
  roles: many({
    sourceField: ['id'],
    destSchema: users_roles,
    destField: ['parent'],
  }),
  ownedPipelines: many({
    sourceField: ['id'],
    destSchema: pipelines,
    destField: ['owner'],
  }),
  assignedTasks: many({
    sourceField: ['id'],
    destSchema: tasks,
    destField: ['assignee'],
  }),
}))

export const users_rolesRelationships = relationships(users_roles, ({ one }) => ({
  user: one({
    sourceField: ['parent'],
    destSchema: users,
    destField: ['id'],
  }),
}))

export const pipelinesRelationships = relationships(pipelines, ({ one, many }) => ({
  ownerUser: one({
    sourceField: ['owner'],
    destSchema: users,
    destField: ['id'],
  }),
  stages: many({
    sourceField: ['id'],
    destSchema: stages,
    destField: ['pipeline'],
  }),
  collaborators: many(
    {
      sourceField: ['id'],
      destSchema: pipelines_rels,
      destField: ['parent'],
    },
    {
      sourceField: ['usersID'],
      destSchema: users,
      destField: ['id'],
    },
  ),
}))

export const pipelines_relsRelationships = relationships(pipelines_rels, ({ one }) => ({
  pipelineParent: one({
    sourceField: ['parent'],
    destSchema: pipelines,
    destField: ['id'],
  }),
  user: one({
    sourceField: ['usersID'],
    destSchema: users,
    destField: ['id'],
  }),
}))

export const stagesRelationships = relationships(stages, ({ one, many }) => ({
  pipelineParent: one({
    sourceField: ['pipeline'],
    destSchema: pipelines,
    destField: ['id'],
  }),
  tasks: many({
    sourceField: ['id'],
    destSchema: tasks,
    destField: ['stage'],
  }),
}))

export const tasksRelationships = relationships(tasks, ({ one, many }) => ({
  stageParent: one({
    sourceField: ['stage'],
    destSchema: stages,
    destField: ['id'],
  }),
  assignedUser: one({
    sourceField: ['assignee'],
    destSchema: users,
    destField: ['id'],
  }),
  labels: many({
    sourceField: ['id'],
    destSchema: tasks_labels,
    destField: ['_parentID'],
  }),
  collaborators: many(
    {
      sourceField: ['id'],
      destSchema: tasks_rels,
      destField: ['parent'],
    },
    {
      sourceField: ['usersID'],
      destSchema: users,
      destField: ['id'],
    },
  ),
}))

export const tasks_labelsRelationships = relationships(tasks_labels, ({ one }) => ({
  taskParent: one({
    sourceField: ['_parentID'],
    destSchema: tasks,
    destField: ['id'],
  }),
}))

export const tasks_relsRelationships = relationships(tasks_rels, ({ one }) => ({
  taskParent: one({
    sourceField: ['parent'],
    destSchema: tasks,
    destField: ['id'],
  }),
  user: one({
    sourceField: ['usersID'],
    destSchema: users,
    destField: ['id'],
  }),
}))

// Create the schema
export const schema = createSchema({
  tables: [
    users,
    users_roles,
    media,
    pipelines,
    pipelines_rels,
    stages,
    tasks,
    tasks_labels,
    tasks_rels,
  ],
  relationships: [
    usersRelationships,
    users_rolesRelationships,
    pipelinesRelationships,
    pipelines_relsRelationships,
    stagesRelationships,
    tasksRelationships,
    tasks_labelsRelationships,
    tasks_relsRelationships,
  ],
})

// Schema type for TypeScript
export type Schema = typeof schema

// Define permissions
export const permissions = definePermissions<{}, Schema>(schema, () => ({
  users: ANYONE_CAN_DO_ANYTHING,
  users_roles: ANYONE_CAN_DO_ANYTHING,
  media: ANYONE_CAN_DO_ANYTHING,
  pipelines: ANYONE_CAN_DO_ANYTHING,
  pipelines_rels: ANYONE_CAN_DO_ANYTHING,
  stages: ANYONE_CAN_DO_ANYTHING,
  tasks: ANYONE_CAN_DO_ANYTHING,
  tasks_labels: ANYONE_CAN_DO_ANYTHING,
  tasks_rels: ANYONE_CAN_DO_ANYTHING,
}))
