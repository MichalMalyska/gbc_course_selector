import { InferSelectModel } from 'drizzle-orm'
import {
  pgTable,
  serial,
  text,
  time,
  timestamp,
  uniqueIndex
} from 'drizzle-orm/pg-core'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!)

export const coursesTable = pgTable('courses', {
  id: serial('id').primaryKey(),
  course_code: text('course_code').notNull(),
  course_prefix: text('course_prefix').notNull(),
  course_number: text('course_number').notNull(),
  course_name: text('course_name').notNull(),
  course_delivery_type: text('course_delivery_type').notNull(),
  prereqs: text('prereqs'),
  hours: text('hours').notNull(),
  fees: text('fees').notNull(),
  course_description: text('course_description'),
  course_link: text('course_link'),
}, (courses) => {
  return {
    uniqueIdx: uniqueIndex('unique_idx').on(courses.course_code),
  }
})

export const schedulesTable = pgTable('schedules', {
  id: serial('id').primaryKey(),
  start_date: timestamp('start_date').notNull(),
  end_date: timestamp('end_date').notNull(),
  day_of_week: text('day_of_week'),
  start_time: time('start_time'),
  end_time: time('end_time'),
  course_id: text('course_id').references(() => coursesTable.id),
}, (schedules) => {
  return {
    unique_idx: uniqueIndex('unique_idx').on(schedules.course_id),
  }
})

export type Course = InferSelectModel<typeof coursesTable>
export type Schedule = InferSelectModel<typeof schedulesTable>

// Connect to  Postgres
export const db = drizzle(sql)
