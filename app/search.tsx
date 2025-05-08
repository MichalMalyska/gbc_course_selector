"use server";

import { coursesTable, db, schedulesTable } from "@/lib/drizzle";
import { and, between, eq, isNotNull, like, or } from "drizzle-orm";

export async function allDepartments() {
  const departments = await db
    .selectDistinct({ department: coursesTable.course_prefix })
    .from(coursesTable)
    .orderBy(coursesTable.course_prefix);
  return departments.map((department) => department.department);
}

export async function allCourses() {
  const courses = await db.select().from(coursesTable);
  return courses;
}

export async function allSchedules() {
  const schedules = await db.select().from(schedulesTable);
  return schedules;
}

export async function allRunningCourses() {
  const runningSessions = await db
    .select()
    .from(schedulesTable)
    .leftJoin(coursesTable, eq(schedulesTable.course_id, coursesTable.id))
    .where(isNotNull(schedulesTable.start_date));
  return runningSessions;
}

export async function searchCourseSessions(
  textSearch: string | null,
  department: string | null,
  deliveryType: string | null,
  startTime: string | null,
  daysOfWeek: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  },
) {
  // Translate start time string to a time
  const time_translator: Record<string, { start: string; end: string }> = {
    morning: { start: "00:00:00", end: "12:00:00" },
    afternoon: { start: "12:00:00", end: "18:00:00" },
    evening: { start: "18:00:00", end: "23:59:59" },
  };

  const conditions = [isNotNull(schedulesTable.start_date)];
  if (textSearch) {
    conditions.push(like(coursesTable.course_name, `%${textSearch}%`));
  }
  if (department) {
    conditions.push(eq(coursesTable.course_prefix, department));
  }
  if (deliveryType) {
    conditions.push(eq(coursesTable.course_delivery_type, deliveryType));
  }
  if (startTime) {
    conditions.push(
      between(
        schedulesTable.start_time,
        time_translator[startTime].start,
        time_translator[startTime].end,
      ),
    );
  }
  // Days of week conditions creation
  // Needs to create an OR statement for each of the days of the week that is true and push just one condition that is the OR statement to the conditions array
  if (daysOfWeek) {
    const daysOfWeekConditions = [];
    for (const day in daysOfWeek) {
      if (daysOfWeek[day as keyof typeof daysOfWeek]) {
        daysOfWeekConditions.push(eq(schedulesTable.day_of_week, day));
      }
    }
    if (daysOfWeekConditions.length > 1) {
      const combinedDaysCondition = or(...daysOfWeekConditions);
      if (combinedDaysCondition) {
        conditions.push(combinedDaysCondition);
      }
    } else if (daysOfWeekConditions.length === 1) {
      conditions.push(daysOfWeekConditions[0]);
    }
  }
  const filteredSessionsQuery = db
    .select()
    .from(schedulesTable)
    .where(and(...conditions))
    .leftJoin(coursesTable, eq(schedulesTable.course_id, coursesTable.id));
  const filteredSessions = await filteredSessionsQuery;

  return filteredSessions;
}
