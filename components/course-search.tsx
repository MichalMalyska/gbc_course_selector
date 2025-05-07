"use server";

import { allDepartments } from "@/lib/utils";
import { CourseSearchInputs } from "./course-search-form";
export async function CourseSearch() {
  const departments = await allDepartments()
  const sorted_departments = departments.sort()
  return (
    <div>
      <CourseSearchInputs allDepartments={sorted_departments} />
    </div>
  )
}