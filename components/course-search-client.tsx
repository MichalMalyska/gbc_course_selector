"use client"

import { searchCourseSessions } from "@/app/search"
import { useEffect, useState } from "react"
import { CourseSearchInputs, SearchCriteria } from "./course-search-form"
import CourseSelector from "./course-selector"

const initialSearchCriteria: SearchCriteria = {
  textSearch: "",
  department: "HOSF",
  deliveryType: "on-campus",
  daysOfWeek: {
    monday: false,
    tuesday: true,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  },
  startTime: "evening",
}

const deliveryTypeLabels: Record<string, string> = {
  online: "Online",
  "on-campus": "On campus",
  both: "Online + on campus",
}

const startTimeLabels: Record<string, string> = {
  morning: "Morning",
  afternoon: "Day",
  evening: "Evening",
}

export function CourseSearchClient({ allDepartments }: { allDepartments: string[] }) {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>(initialSearchCriteria)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    const fetchSearchResults = async () => {
      setIsLoading(true)
      setSearchError(null)

      try {
        const results = await searchCourseSessions(
          searchCriteria.textSearch,
          searchCriteria.department,
          searchCriteria.deliveryType,
          searchCriteria.startTime,
          searchCriteria.daysOfWeek
        )

        if (!isCancelled) {
          setSearchResults(results)
          setLastUpdated(new Date().toISOString())
        }
      } catch (error) {
        console.error("Error loading search results:", error)

        if (!isCancelled) {
          setSearchError("The course list could not be refreshed.")
          setSearchResults([])
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchSearchResults()

    return () => {
      isCancelled = true
    }
  }, [searchCriteria])

  const selectedDays = Object.entries(searchCriteria.daysOfWeek)
    .filter(([, selected]) => selected)
    .map(([day]) => day.slice(0, 3).replace(day[0], day[0].toUpperCase()))

  const activeFilters = [
    `Department: ${searchCriteria.department}`,
    `Delivery: ${deliveryTypeLabels[searchCriteria.deliveryType] ?? searchCriteria.deliveryType}`,
    `Time: ${startTimeLabels[searchCriteria.startTime] ?? searchCriteria.startTime}`,
    ...(searchCriteria.textSearch ? [`Search: ${searchCriteria.textSearch}`] : []),
    ...(selectedDays.length ? [`Days: ${selectedDays.join(", ")}`] : []),
  ]

  const formattedUpdatedAt = lastUpdated
    ? new Intl.DateTimeFormat("en-CA", {
        hour: "numeric",
        minute: "2-digit",
        month: "short",
        day: "numeric",
      }).format(new Date(lastUpdated))
    : null

  return (
    <section className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
      <aside className="lg:sticky lg:top-6">
        <CourseSearchInputs
          allDepartments={allDepartments}
          searchCriteria={searchCriteria}
          setSearchCriteria={setSearchCriteria}
        />
      </aside>

      <div className="space-y-4">
        <section className="surface-panel rounded-[2rem] p-4 sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--text-muted)]">Results</p>
              <h2 className="text-xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-2xl">
                {isLoading ? "Refreshing courses..." : `${searchResults.length} matching sessions`}
              </h2>
              <p className="text-xs sm:text-sm text-[color:var(--text-secondary)]">
                {searchError
                  ? searchError
                  : formattedUpdatedAt
                    ? `Updated ${formattedUpdatedAt}`
                    : "Fetching the latest course list."}
              </p>
            </div>
            <div className="surface-muted rounded-[1.25rem] px-3 py-2 text-xs sm:text-sm text-[color:var(--text-secondary)]">
              Active filters:{" "}
              <span className="font-semibold text-[color:var(--text-primary)]">{activeFilters.length}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <span key={filter} className="chip">
                {filter}
              </span>
            ))}
          </div>
        </section>

        <CourseSelector searchResults={searchResults} isLoading={isLoading} searchError={searchError} />
      </div>
    </section>
  )
}
