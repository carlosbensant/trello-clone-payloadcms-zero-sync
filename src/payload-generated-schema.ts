/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:db-schema` to regenerate this file.
 */

import type {} from '@payloadcms/db-postgres'
import {
  pgTable,
  index,
  uniqueIndex,
  foreignKey,
  integer,
  uuid,
  varchar,
  jsonb,
  timestamp,
  numeric,
  boolean,
  serial,
  pgEnum,
} from '@payloadcms/db-postgres/drizzle/pg-core'
import { sql, relations } from '@payloadcms/db-postgres/drizzle'
export const enum_users_roles = pgEnum('enum_users_roles', ['admin', 'user'])
export const enum_users_gender = pgEnum('enum_users_gender', ['male', 'female'])

export const users_roles = pgTable(
  'users_roles',
  {
    order: integer('order').notNull(),
    parent: uuid('parent_id').notNull(),
    value: enum_users_roles('value'),
    id: uuid('id').defaultRandom().primaryKey(),
  },
  (columns) => ({
    orderIdx: index('users_roles_order_idx').on(columns.order),
    parentIdx: index('users_roles_parent_idx').on(columns.parent),
    value: index('users_roles_value_idx').on(columns.value),
    parentFk: foreignKey({
      columns: [columns['parent']],
      foreignColumns: [users.id],
      name: 'users_roles_parent_fk',
    }).onDelete('cascade'),
  }),
)

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    sub: varchar('sub').notNull(),
    username: varchar('username').notNull(),
    name: varchar('name').notNull().default(''),
    first_name: varchar('first_name').notNull().default(''),
    last_name: varchar('last_name').notNull().default(''),
    position: varchar('position'),
    image_id: uuid('image_id').references(() => media.id, {
      onDelete: 'set null',
    }),
    description: jsonb('description'),
    mobile: varchar('mobile'),
    phone: varchar('phone'),
    gender: enum_users_gender('gender'),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    email: varchar('email').notNull(),
    resetPasswordToken: varchar('reset_password_token'),
    resetPasswordExpiration: timestamp('reset_password_expiration', {
      mode: 'string',
      withTimezone: true,
      precision: 3,
    }),
    salt: varchar('salt'),
    hash: varchar('hash'),
    loginAttempts: numeric('login_attempts').default('0'),
    lockUntil: timestamp('lock_until', { mode: 'string', withTimezone: true, precision: 3 }),
  },
  (columns) => ({
    users_username_idx: uniqueIndex('users_username_idx').on(columns.username),
    users_image_idx: index('users_image_idx').on(columns.image_id),
    users_updated_at_idx: index('users_updated_at_idx').on(columns.updatedAt),
    users_created_at_idx: index('users_created_at_idx').on(columns.createdAt),
    users_email_idx: uniqueIndex('users_email_idx').on(columns.email),
  }),
)

export const media = pgTable(
  'media',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    alt: varchar('alt').notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    url: varchar('url'),
    thumbnailURL: varchar('thumbnail_u_r_l'),
    filename: varchar('filename'),
    mimeType: varchar('mime_type'),
    filesize: numeric('filesize'),
    width: numeric('width'),
    height: numeric('height'),
    focalX: numeric('focal_x'),
    focalY: numeric('focal_y'),
  },
  (columns) => ({
    media_updated_at_idx: index('media_updated_at_idx').on(columns.updatedAt),
    media_created_at_idx: index('media_created_at_idx').on(columns.createdAt),
    media_filename_idx: uniqueIndex('media_filename_idx').on(columns.filename),
  }),
)

export const pipelines = pgTable(
  'pipelines',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title').notNull(),
    description: varchar('description'),
    backgroundColor: varchar('background_color').default('#0079bf'),
    owner_id: uuid('owner_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'set null',
      }),
    isPrivate: boolean('is_private').default(false),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    pipelines_owner_idx: index('pipelines_owner_idx').on(columns.owner_id),
    pipelines_updated_at_idx: index('pipelines_updated_at_idx').on(columns.updatedAt),
    pipelines_created_at_idx: index('pipelines_created_at_idx').on(columns.createdAt),
  }),
)

export const pipelines_rels = pgTable(
  'pipelines_rels',
  {
    id: serial('id').primaryKey(),
    order: integer('order'),
    parent: uuid('parent_id').notNull(),
    path: varchar('path').notNull(),
    usersID: uuid('users_id'),
  },
  (columns) => ({
    order: index('pipelines_rels_order_idx').on(columns.order),
    parentIdx: index('pipelines_rels_parent_idx').on(columns.parent),
    pathIdx: index('pipelines_rels_path_idx').on(columns.path),
    pipelines_rels_users_id_idx: index('pipelines_rels_users_id_idx').on(columns.usersID),
    parentFk: foreignKey({
      columns: [columns['parent']],
      foreignColumns: [pipelines.id],
      name: 'pipelines_rels_parent_fk',
    }).onDelete('cascade'),
    usersIdFk: foreignKey({
      columns: [columns['usersID']],
      foreignColumns: [users.id],
      name: 'pipelines_rels_users_fk',
    }).onDelete('cascade'),
  }),
)

export const stages = pgTable(
  'stages',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title').notNull(),
    pipeline_id: uuid('pipeline_id')
      .notNull()
      .references(() => pipelines.id, {
        onDelete: 'set null',
      }),
    position: numeric('position').notNull().default('0'),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    stages_pipeline_idx: index('stages_pipeline_idx').on(columns.pipeline_id),
    stages_updated_at_idx: index('stages_updated_at_idx').on(columns.updatedAt),
    stages_created_at_idx: index('stages_created_at_idx').on(columns.createdAt),
  }),
)

export const tasks_labels = pgTable(
  'tasks_labels',
  {
    _order: integer('_order').notNull(),
    _parentID: uuid('_parent_id').notNull(),
    id: varchar('id').primaryKey(),
    name: varchar('name'),
    color: varchar('color').default('#61bd4f'),
  },
  (columns) => ({
    _orderIdx: index('tasks_labels_order_idx').on(columns._order),
    _parentIDIdx: index('tasks_labels_parent_id_idx').on(columns._parentID),
    _parentIDFk: foreignKey({
      columns: [columns['_parentID']],
      foreignColumns: [tasks.id],
      name: 'tasks_labels_parent_id_fk',
    }).onDelete('cascade'),
  }),
)

export const tasks = pgTable(
  'tasks',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title').notNull(),
    description: varchar('description'),
    stage_id: uuid('stage_id')
      .notNull()
      .references(() => stages.id, {
        onDelete: 'set null',
      }),
    position: numeric('position').notNull().default('0'),
    assignee_id: uuid('assignee_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    dueDate: timestamp('due_date', { mode: 'string', withTimezone: true, precision: 3 }),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    tasks_stage_idx: index('tasks_stage_idx').on(columns.stage_id),
    tasks_assignee_idx: index('tasks_assignee_idx').on(columns.assignee_id),
    tasks_updated_at_idx: index('tasks_updated_at_idx').on(columns.updatedAt),
    tasks_created_at_idx: index('tasks_created_at_idx').on(columns.createdAt),
  }),
)

export const tasks_rels = pgTable(
  'tasks_rels',
  {
    id: serial('id').primaryKey(),
    order: integer('order'),
    parent: uuid('parent_id').notNull(),
    path: varchar('path').notNull(),
    usersID: uuid('users_id'),
  },
  (columns) => ({
    order: index('tasks_rels_order_idx').on(columns.order),
    parentIdx: index('tasks_rels_parent_idx').on(columns.parent),
    pathIdx: index('tasks_rels_path_idx').on(columns.path),
    tasks_rels_users_id_idx: index('tasks_rels_users_id_idx').on(columns.usersID),
    parentFk: foreignKey({
      columns: [columns['parent']],
      foreignColumns: [tasks.id],
      name: 'tasks_rels_parent_fk',
    }).onDelete('cascade'),
    usersIdFk: foreignKey({
      columns: [columns['usersID']],
      foreignColumns: [users.id],
      name: 'tasks_rels_users_fk',
    }).onDelete('cascade'),
  }),
)

export const payload_locked_documents = pgTable(
  'payload_locked_documents',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    globalSlug: varchar('global_slug'),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    payload_locked_documents_global_slug_idx: index('payload_locked_documents_global_slug_idx').on(
      columns.globalSlug,
    ),
    payload_locked_documents_updated_at_idx: index('payload_locked_documents_updated_at_idx').on(
      columns.updatedAt,
    ),
    payload_locked_documents_created_at_idx: index('payload_locked_documents_created_at_idx').on(
      columns.createdAt,
    ),
  }),
)

export const payload_locked_documents_rels = pgTable(
  'payload_locked_documents_rels',
  {
    id: serial('id').primaryKey(),
    order: integer('order'),
    parent: uuid('parent_id').notNull(),
    path: varchar('path').notNull(),
    usersID: uuid('users_id'),
    mediaID: uuid('media_id'),
    pipelinesID: uuid('pipelines_id'),
    stagesID: uuid('stages_id'),
    tasksID: uuid('tasks_id'),
  },
  (columns) => ({
    order: index('payload_locked_documents_rels_order_idx').on(columns.order),
    parentIdx: index('payload_locked_documents_rels_parent_idx').on(columns.parent),
    pathIdx: index('payload_locked_documents_rels_path_idx').on(columns.path),
    payload_locked_documents_rels_users_id_idx: index(
      'payload_locked_documents_rels_users_id_idx',
    ).on(columns.usersID),
    payload_locked_documents_rels_media_id_idx: index(
      'payload_locked_documents_rels_media_id_idx',
    ).on(columns.mediaID),
    payload_locked_documents_rels_pipelines_id_idx: index(
      'payload_locked_documents_rels_pipelines_id_idx',
    ).on(columns.pipelinesID),
    payload_locked_documents_rels_stages_id_idx: index(
      'payload_locked_documents_rels_stages_id_idx',
    ).on(columns.stagesID),
    payload_locked_documents_rels_tasks_id_idx: index(
      'payload_locked_documents_rels_tasks_id_idx',
    ).on(columns.tasksID),
    parentFk: foreignKey({
      columns: [columns['parent']],
      foreignColumns: [payload_locked_documents.id],
      name: 'payload_locked_documents_rels_parent_fk',
    }).onDelete('cascade'),
    usersIdFk: foreignKey({
      columns: [columns['usersID']],
      foreignColumns: [users.id],
      name: 'payload_locked_documents_rels_users_fk',
    }).onDelete('cascade'),
    mediaIdFk: foreignKey({
      columns: [columns['mediaID']],
      foreignColumns: [media.id],
      name: 'payload_locked_documents_rels_media_fk',
    }).onDelete('cascade'),
    pipelinesIdFk: foreignKey({
      columns: [columns['pipelinesID']],
      foreignColumns: [pipelines.id],
      name: 'payload_locked_documents_rels_pipelines_fk',
    }).onDelete('cascade'),
    stagesIdFk: foreignKey({
      columns: [columns['stagesID']],
      foreignColumns: [stages.id],
      name: 'payload_locked_documents_rels_stages_fk',
    }).onDelete('cascade'),
    tasksIdFk: foreignKey({
      columns: [columns['tasksID']],
      foreignColumns: [tasks.id],
      name: 'payload_locked_documents_rels_tasks_fk',
    }).onDelete('cascade'),
  }),
)

export const payload_preferences = pgTable(
  'payload_preferences',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    key: varchar('key'),
    value: jsonb('value'),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    payload_preferences_key_idx: index('payload_preferences_key_idx').on(columns.key),
    payload_preferences_updated_at_idx: index('payload_preferences_updated_at_idx').on(
      columns.updatedAt,
    ),
    payload_preferences_created_at_idx: index('payload_preferences_created_at_idx').on(
      columns.createdAt,
    ),
  }),
)

export const payload_preferences_rels = pgTable(
  'payload_preferences_rels',
  {
    id: serial('id').primaryKey(),
    order: integer('order'),
    parent: uuid('parent_id').notNull(),
    path: varchar('path').notNull(),
    usersID: uuid('users_id'),
  },
  (columns) => ({
    order: index('payload_preferences_rels_order_idx').on(columns.order),
    parentIdx: index('payload_preferences_rels_parent_idx').on(columns.parent),
    pathIdx: index('payload_preferences_rels_path_idx').on(columns.path),
    payload_preferences_rels_users_id_idx: index('payload_preferences_rels_users_id_idx').on(
      columns.usersID,
    ),
    parentFk: foreignKey({
      columns: [columns['parent']],
      foreignColumns: [payload_preferences.id],
      name: 'payload_preferences_rels_parent_fk',
    }).onDelete('cascade'),
    usersIdFk: foreignKey({
      columns: [columns['usersID']],
      foreignColumns: [users.id],
      name: 'payload_preferences_rels_users_fk',
    }).onDelete('cascade'),
  }),
)

export const payload_migrations = pgTable(
  'payload_migrations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name'),
    batch: numeric('batch'),
    updatedAt: timestamp('updated_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'string', withTimezone: true, precision: 3 })
      .defaultNow()
      .notNull(),
  },
  (columns) => ({
    payload_migrations_updated_at_idx: index('payload_migrations_updated_at_idx').on(
      columns.updatedAt,
    ),
    payload_migrations_created_at_idx: index('payload_migrations_created_at_idx').on(
      columns.createdAt,
    ),
  }),
)

export const relations_users_roles = relations(users_roles, ({ one }) => ({
  parent: one(users, {
    fields: [users_roles.parent],
    references: [users.id],
    relationName: 'roles',
  }),
}))
export const relations_users = relations(users, ({ one, many }) => ({
  image: one(media, {
    fields: [users.image_id],
    references: [media.id],
    relationName: 'image',
  }),
  roles: many(users_roles, {
    relationName: 'roles',
  }),
}))
export const relations_media = relations(media, () => ({}))
export const relations_pipelines_rels = relations(pipelines_rels, ({ one }) => ({
  parent: one(pipelines, {
    fields: [pipelines_rels.parent],
    references: [pipelines.id],
    relationName: '_rels',
  }),
  usersID: one(users, {
    fields: [pipelines_rels.usersID],
    references: [users.id],
    relationName: 'users',
  }),
}))
export const relations_pipelines = relations(pipelines, ({ one, many }) => ({
  owner: one(users, {
    fields: [pipelines.owner_id],
    references: [users.id],
    relationName: 'owner',
  }),
  _rels: many(pipelines_rels, {
    relationName: '_rels',
  }),
}))
export const relations_stages = relations(stages, ({ one }) => ({
  pipeline: one(pipelines, {
    fields: [stages.pipeline_id],
    references: [pipelines.id],
    relationName: 'pipeline',
  }),
}))
export const relations_tasks_labels = relations(tasks_labels, ({ one }) => ({
  _parentID: one(tasks, {
    fields: [tasks_labels._parentID],
    references: [tasks.id],
    relationName: 'labels',
  }),
}))
export const relations_tasks_rels = relations(tasks_rels, ({ one }) => ({
  parent: one(tasks, {
    fields: [tasks_rels.parent],
    references: [tasks.id],
    relationName: '_rels',
  }),
  usersID: one(users, {
    fields: [tasks_rels.usersID],
    references: [users.id],
    relationName: 'users',
  }),
}))
export const relations_tasks = relations(tasks, ({ one, many }) => ({
  stage: one(stages, {
    fields: [tasks.stage_id],
    references: [stages.id],
    relationName: 'stage',
  }),
  assignee: one(users, {
    fields: [tasks.assignee_id],
    references: [users.id],
    relationName: 'assignee',
  }),
  labels: many(tasks_labels, {
    relationName: 'labels',
  }),
  _rels: many(tasks_rels, {
    relationName: '_rels',
  }),
}))
export const relations_payload_locked_documents_rels = relations(
  payload_locked_documents_rels,
  ({ one }) => ({
    parent: one(payload_locked_documents, {
      fields: [payload_locked_documents_rels.parent],
      references: [payload_locked_documents.id],
      relationName: '_rels',
    }),
    usersID: one(users, {
      fields: [payload_locked_documents_rels.usersID],
      references: [users.id],
      relationName: 'users',
    }),
    mediaID: one(media, {
      fields: [payload_locked_documents_rels.mediaID],
      references: [media.id],
      relationName: 'media',
    }),
    pipelinesID: one(pipelines, {
      fields: [payload_locked_documents_rels.pipelinesID],
      references: [pipelines.id],
      relationName: 'pipelines',
    }),
    stagesID: one(stages, {
      fields: [payload_locked_documents_rels.stagesID],
      references: [stages.id],
      relationName: 'stages',
    }),
    tasksID: one(tasks, {
      fields: [payload_locked_documents_rels.tasksID],
      references: [tasks.id],
      relationName: 'tasks',
    }),
  }),
)
export const relations_payload_locked_documents = relations(
  payload_locked_documents,
  ({ many }) => ({
    _rels: many(payload_locked_documents_rels, {
      relationName: '_rels',
    }),
  }),
)
export const relations_payload_preferences_rels = relations(
  payload_preferences_rels,
  ({ one }) => ({
    parent: one(payload_preferences, {
      fields: [payload_preferences_rels.parent],
      references: [payload_preferences.id],
      relationName: '_rels',
    }),
    usersID: one(users, {
      fields: [payload_preferences_rels.usersID],
      references: [users.id],
      relationName: 'users',
    }),
  }),
)
export const relations_payload_preferences = relations(payload_preferences, ({ many }) => ({
  _rels: many(payload_preferences_rels, {
    relationName: '_rels',
  }),
}))
export const relations_payload_migrations = relations(payload_migrations, () => ({}))

type DatabaseSchema = {
  enum_users_roles: typeof enum_users_roles
  enum_users_gender: typeof enum_users_gender
  users_roles: typeof users_roles
  users: typeof users
  media: typeof media
  pipelines: typeof pipelines
  pipelines_rels: typeof pipelines_rels
  stages: typeof stages
  tasks_labels: typeof tasks_labels
  tasks: typeof tasks
  tasks_rels: typeof tasks_rels
  payload_locked_documents: typeof payload_locked_documents
  payload_locked_documents_rels: typeof payload_locked_documents_rels
  payload_preferences: typeof payload_preferences
  payload_preferences_rels: typeof payload_preferences_rels
  payload_migrations: typeof payload_migrations
  relations_users_roles: typeof relations_users_roles
  relations_users: typeof relations_users
  relations_media: typeof relations_media
  relations_pipelines_rels: typeof relations_pipelines_rels
  relations_pipelines: typeof relations_pipelines
  relations_stages: typeof relations_stages
  relations_tasks_labels: typeof relations_tasks_labels
  relations_tasks_rels: typeof relations_tasks_rels
  relations_tasks: typeof relations_tasks
  relations_payload_locked_documents_rels: typeof relations_payload_locked_documents_rels
  relations_payload_locked_documents: typeof relations_payload_locked_documents
  relations_payload_preferences_rels: typeof relations_payload_preferences_rels
  relations_payload_preferences: typeof relations_payload_preferences
  relations_payload_migrations: typeof relations_payload_migrations
}

declare module '@payloadcms/db-postgres' {
  export interface GeneratedDatabaseSchema {
    schema: DatabaseSchema
  }
}
