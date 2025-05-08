import { CourseSearchClient } from "@/components/course-search-client";
import CourseSelector from "@/components/course-selector";
import CourseSelectorPlaceholder from "@/components/course-selector-placeholder";
import RefreshButton from "@/components/refresh-button";
import { Suspense } from "react";
import { allDepartments } from "./search";
export const dynamic = "force-dynamic";

export default async function Home() {
  const departments = await allDepartments();
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <h1 className="pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#4b4b4b] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        George Brown Course Scheduler
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <CourseSearchClient allDepartments={departments} />
      </Suspense>
      <div className="refresh-button">
        <RefreshButton />
      </div>
      <Suspense fallback={<CourseSelectorPlaceholder />}>
        <CourseSelector />
      </Suspense>
    </main>
  );
}
