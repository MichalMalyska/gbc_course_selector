import { InferSelectModel } from "drizzle-orm"
import { date, integer, pgTable, serial, text, time, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

let sqlConnection: ReturnType<typeof postgres>
try {
  sqlConnection = postgres(process.env.POSTGRES_URL!)
} catch (error) {
  console.error("Error in connecting to Postgres:", error)
  throw error
}

export const coursesTable = pgTable(
  "courses",
  {
    id: serial("id").primaryKey(),
    course_code: text("course_code").notNull(),
    course_prefix: text("course_prefix").notNull(),
    course_number: text("course_number").notNull(),
    course_name: text("course_name").notNull(),
    course_delivery_type: text("course_delivery_type").notNull(),
    prereqs: text("prereqs"),
    hours: text("hours").notNull(),
    fees: text("fees").notNull(),
    course_description: text("course_description"),
    course_link: text("course_link"),
    last_seen_at: timestamp("last_seen_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (courses) => {
    return {
      uniqueIdx: uniqueIndex("courses_course_code_unique_idx").on(courses.course_code),
    }
  }
)

export const schedulesTable = pgTable("schedules", {
  id: serial("id").primaryKey(),
  start_date: date("start_date", { mode: "string" }).notNull(),
  end_date: date("end_date", { mode: "string" }).notNull(),
  day_of_week: text("day_of_week"),
  start_time: time("start_time"),
  end_time: time("end_time"),
  course_id: integer("course_id")
    .notNull()
    .references(() => coursesTable.id, { onDelete: "cascade" }),
})

export type Course = InferSelectModel<typeof coursesTable>
export type Schedule = InferSelectModel<typeof schedulesTable>

// Connect to  Postgres
let db: ReturnType<typeof drizzle>

try {
  db = drizzle(sqlConnection)
} catch (error) {
  console.error("Error in initializing Drizzle:", error)
  throw error
}

export { db }
