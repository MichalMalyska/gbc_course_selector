import { CourseSearchClient } from "@/components/course-search-client"
import CourseSelectorPlaceholder from "@/components/course-selector-placeholder"
import { ThemeToggle } from "@/components/theme-toggle"
import { Suspense } from "react"
import { allDepartments } from "./search"
export const dynamic = "force-dynamic"

export default async function Home() {
  try {
    const departments = await allDepartments()
    return (
      <main className="min-h-screen px-3 py-4 sm:px-4 sm:py-6 lg:px-5 xl:px-6">
        <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-6">
          <header className="surface-page rounded-[2rem] p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                  Course Planning Utility
                </p>
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-4xl lg:text-5xl">
                    George Brown Course Search
                  </h1>
                  <p className="max-w-3xl text-sm leading-6 text-[color:var(--text-secondary)] sm:text-base">
                    Search current offerings by course, department, delivery type, day, and time window.
                  </p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </header>
          <Suspense fallback={<CourseSelectorPlaceholder />}>
            <CourseSearchClient allDepartments={departments} />
          </Suspense>
        </div>
      </main>
    )
  } catch (error) {
    console.error("Error in Home component:", error)
    // You might want to return a user-friendly error page here
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="surface-panel w-full max-w-xl rounded-[2rem] p-8 text-center">
          <h1 className="text-2xl font-semibold text-[color:var(--text-primary)]">Something went wrong.</h1>
          <p className="mt-3 text-sm text-[color:var(--text-secondary)]">
            The course data could not be loaded right now.
          </p>
        </div>
      </main>
    )
  }
}
