import { CourseSearchClient } from "@/components/course-search-client"
import { Suspense } from "react"
import { allDepartments } from "./search"

export const dynamic = "force-dynamic"

export default async function Home() {
  try {
    const departments = await allDepartments()
    return (
      <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <header className="rounded-3xl border border-slate-200/80 bg-white/90 px-5 py-5 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.55)] sm:px-6">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              George Brown Course Scheduler
            </h1>
          </header>

          <Suspense
            fallback={
              <div className="rounded-3xl border border-slate-200/80 bg-white/90 px-6 py-10 text-sm text-slate-500 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.45)]">
                Loading scheduler...
              </div>
            }
          >
            <CourseSearchClient allDepartments={departments} />
          </Suspense>
        </div>
      </main>
    )
  } catch (error) {
    console.error("Error in Home component:", error)
    return (
      <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-rose-200 bg-white px-6 py-10 text-rose-700 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.45)]">
            Something went wrong.
          </div>
        </div>
      </main>
    )
  }
}
