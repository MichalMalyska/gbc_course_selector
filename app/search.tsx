"use server";

import { coursesTable, db, schedulesTable } from "@/lib/drizzle";
import { and, between, eq, isNotNull, like } from "drizzle-orm";
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
  startTime: string | null
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
        time_translator[startTime].end
      )
    );
  }

  const filteredSessionsQuery = db
    .select()
    .from(schedulesTable)
    .where(and(...conditions))
    .leftJoin(coursesTable, eq(schedulesTable.course_id, coursesTable.id));
  const filteredSessions = await filteredSessionsQuery;

  return filteredSessions;
}
