"use server";

import { allDepartments } from "@/lib/utils";
import { CourseSearchInputs } from "./course-search-form";
export async function CourseSearch() {
  const departments = await allDepartments()
  return (
    <div>
      <CourseSearchInputs allDepartments={departments} />
    </div>
  )
}