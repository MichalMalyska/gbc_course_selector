import { CourseSearchClient } from "@/components/course-search-client"
import { Suspense } from "react"
import { allDepartments } from "./search"
export const dynamic = "force-dynamic"

export default async function Home() {
  try {
    const departments = await allDepartments()
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center">
        <h1 className="pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#4b4b4b] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
          George Brown Course Scheduler
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <CourseSearchClient allDepartments={departments} />
        </Suspense>
      </main>
    )
  } catch (error) {
    console.error("Error in Home component:", error)
    // You might want to return a user-friendly error page here
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center">
        <h1>Something went wrong.</h1>
      </main>
    )
  }
}
