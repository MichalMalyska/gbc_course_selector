import { InferSelectModel } from 'drizzle-orm'
import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex
} from 'drizzle-orm/pg-core'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export const coursesTable = pgTable('courses', {
  id: serial('id').primaryKey(),
  courseCode: text('courseCode').notNull(),
  coursePrefix: text('coursePrefix').notNull(),
  courseNumber: text('courseNumber').notNull(),
  courseName: text('courseName').notNull(),
  courseDeliveryType: text('courseDeliveryType').notNull(),
  prereqs: text('prereqs'),
  hours: text('hours').notNull(),
  fees: text('fees').notNull(),
  courseDescription: text('courseDescription'),
  courseLink: text('courseLink'),
}, (courses) => {
  return {
    uniqueIdx: uniqueIndex('unique_idx').on(courses.courseCode),
  }
})

export const schedulesTable = pgTable('schedules', {
  id: serial('id').primaryKey(),
  startDate: timestamp('startDate').notNull(),
  endDate: timestamp('endDate').notNull(),
  dayOfWeek: text('dayOfWeek'),
  startTime: timestamp('startTime'),
  endTime: timestamp('endTime'),
  courseId: text('courseId').references(() => coursesTable.id),
}, (schedules) => {
  return {
    uniqueIdx: uniqueIndex('unique_idx').on(schedules.courseId),
  }
})

export type Course = InferSelectModel<typeof coursesTable>
export type Schedule = InferSelectModel<typeof schedulesTable>

// Connect to  Postgres
export const db = drizzle(sql)
