import ms from 'ms'
import { coursesTable, db } from './drizzle'

export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
  if (!timestamp) return 'never'
  return `${ms(Date.now() - new Date(timestamp).getTime())}${
    timeOnly ? '' : ' ago'
  }`
}

export async function allDepartments() {
  const departments = await db.selectDistinct({department: coursesTable.course_prefix}).from(coursesTable).orderBy(coursesTable.course_prefix)
  return departments.map((department) => department.department)
}