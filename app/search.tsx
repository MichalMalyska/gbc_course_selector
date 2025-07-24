"use server"

import { coursesTable, db, schedulesTable } from "@/lib/drizzle"
import { and, between, eq, gt, ilike, isNotNull, lt, or } from "drizzle-orm"

export async function allDepartments() {
  try {
    const departments = await db
      .selectDistinct({ department: coursesTable.course_prefix })
      .from(coursesTable)
      .orderBy(coursesTable.course_prefix)
    return departments.map((department: { department: string }) => department.department)
  } catch (error) {
    console.error("Error in fetching departments:", error)
    throw error
  }
}

export async function allCourses() {
  const courses = await db.select().from(coursesTable)
  return courses
}

export async function allSchedules() {
  const schedules = await db.select().from(schedulesTable)
  return schedules
}

export async function allRunningCourses() {
  const runningSessions = await db
    .select()
    .from(schedulesTable)
    .leftJoin(coursesTable, eq(schedulesTable.course_id, coursesTable.id))
    .where(isNotNull(schedulesTable.start_date))
  return runningSessions
}

export async function searchCourseSessions(
  textSearch: string | null,
  department: string | null,
  deliveryType: string | null, // "Online" or "On Campus"
  startTime: string | null,
  daysOfWeek: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
  }
) {
  const conditions = [isNotNull(schedulesTable.start_date)]
  // Translate start time string to a time
  if (startTime) {
    if (startTime === "morning") {
      conditions.push(lt(schedulesTable.start_time, "12:00:00"))
    } else if (startTime === "afternoon") {
      conditions.push(between(schedulesTable.start_time, "12:00:00", "18:00:00"))
    } else if (startTime === "evening") {
      conditions.push(gt(schedulesTable.start_time, "18:00:00"))
    }
  }

  if (textSearch) {
    conditions.push(ilike(coursesTable.course_name, `%${textSearch}%`))
  }
  if (department) {
    conditions.push(eq(coursesTable.course_prefix, department))
  }
  if (deliveryType) {
    let queryDeliveryType = deliveryType
    if (deliveryType.toLowerCase() === "online") {
      queryDeliveryType = "Online"
    } else if (deliveryType.toLowerCase() === "on-campus") {
      queryDeliveryType = "On Campus"
    }
    conditions.push(eq(coursesTable.course_delivery_type, queryDeliveryType))
  }
  // Days of week conditions creation
  // Needs to create an OR statement for each of the days of the week that is true and push just one condition that is the OR statement to the conditions array
  if (daysOfWeek) {
    const daysOfWeekConditions = []
    for (const day in daysOfWeek) {
      if (daysOfWeek[day as keyof typeof daysOfWeek]) {
        const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1)
        daysOfWeekConditions.push(eq(schedulesTable.day_of_week, capitalizedDay))
      }
    }
    if (daysOfWeekConditions.length > 1) {
      const combinedDaysCondition = or(...daysOfWeekConditions)
      if (combinedDaysCondition) {
        conditions.push(combinedDaysCondition)
      }
    } else if (daysOfWeekConditions.length === 1) {
      conditions.push(daysOfWeekConditions[0])
    }
  }
  const filteredSessionsQuery = db
    .select()
    .from(schedulesTable)
    .where(and(...conditions))
    .leftJoin(coursesTable, eq(schedulesTable.course_id, coursesTable.id))
  const filteredSessions = await filteredSessionsQuery
  return filteredSessions
}
