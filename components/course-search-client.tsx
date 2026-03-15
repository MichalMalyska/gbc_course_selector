"use client"

import { searchCourseSessions } from "@/app/search"
import {
  createDefaultSearchCriteria,
  dayOptions,
  deliveryTypeLabels,
  type CourseSearchResult,
  type SearchCriteria,
  timeFilterLabels,
} from "@/lib/course-search"
import { useEffect, useState } from "react"
import { CourseSearchInputs } from "./course-search-form"
import CourseSelector from "./course-selector"

type ActiveFilter = {
  id: string
  label: string
  onRemove: () => void
}

export function CourseSearchClient({ allDepartments }: { allDepartments: string[] }) {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>(() => createDefaultSearchCriteria())
  const [searchResults, setSearchResults] = useState<CourseSearchResult[]>([])
  const [debouncedTextSearch, setDebouncedTextSearch] = useState(searchCriteria.textSearch)
  const [isLoading, setIsLoading] = useState(true)
  const [searchError, setSearchError] = useState<string | null>(null)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedTextSearch(searchCriteria.textSearch)
    }, 250)

    return () => window.clearTimeout(timeoutId)
  }, [searchCriteria.textSearch])

  useEffect(() => {
    let isCancelled = false

    async function fetchSearchResults() {
      setIsLoading(true)
      setSearchError(null)

      try {
        const results = await searchCourseSessions(
          debouncedTextSearch,
          searchCriteria.department,
          searchCriteria.deliveryType,
          searchCriteria.startTime,
          searchCriteria.daysOfWeek
        )

        if (!isCancelled) {
          setSearchResults(results)
        }
      } catch (error) {
        console.error("Error fetching search results:", error)
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
  }, [
    debouncedTextSearch,
    searchCriteria.daysOfWeek,
    searchCriteria.department,
    searchCriteria.deliveryType,
    searchCriteria.startTime,
  ])

  const activeFilters: ActiveFilter[] = []

  if (searchCriteria.textSearch.trim()) {
    activeFilters.push({
      id: "text",
      label: `Search: ${searchCriteria.textSearch.trim()}`,
      onRemove: () =>
        setSearchCriteria((current) => ({
          ...current,
          textSearch: "",
        })),
    })
  }

  if (searchCriteria.department) {
    activeFilters.push({
      id: "department",
      label: searchCriteria.department,
      onRemove: () =>
        setSearchCriteria((current) => ({
          ...current,
          department: "",
        })),
    })
  }

  if (searchCriteria.deliveryType !== "any") {
    activeFilters.push({
      id: "delivery",
      label: deliveryTypeLabels[searchCriteria.deliveryType],
      onRemove: () =>
        setSearchCriteria((current) => ({
          ...current,
          deliveryType: "any",
        })),
    })
  }

  dayOptions.forEach((day) => {
    if (!searchCriteria.daysOfWeek[day.key]) {
      return
    }

    activeFilters.push({
      id: day.key,
      label: day.label,
      onRemove: () =>
        setSearchCriteria((current) => ({
          ...current,
          daysOfWeek: {
            ...current.daysOfWeek,
            [day.key]: false,
          },
        })),
    })
  })

  if (searchCriteria.startTime !== "any") {
    activeFilters.push({
      id: "time",
      label: timeFilterLabels[searchCriteria.startTime],
      onRemove: () =>
        setSearchCriteria((current) => ({
          ...current,
          startTime: "any",
        })),
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <CourseSearchInputs
          allDepartments={allDepartments}
          searchCriteria={searchCriteria}
          setSearchCriteria={setSearchCriteria}
        />
      </aside>

      <section className="min-w-0 space-y-4">
        <div className="surface-panel rounded-3xl p-4">
          <div className="flex flex-col gap-3 border-b border-[color:var(--border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[color:var(--text-muted)]">Results</p>
              <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--text-primary)]">
                {searchResults.length} matches
              </h2>
              {searchError ? (
                <p className="mt-1 text-xs sm:text-sm text-[color:var(--text-secondary)]">{searchError}</p>
              ) : null}
            </div>
            <div className="flex items-center gap-2 text-sm text-[color:var(--text-secondary)]">
              <span
                className={`h-2.5 w-2.5 rounded-full ${isLoading ? "animate-pulse bg-[color:var(--accent)]" : "bg-[color:var(--accent-strong)]"}`}
              />
              {isLoading ? "Updating" : "Up to date"}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <button key={filter.id} type="button" onClick={filter.onRemove} className="chip">
                {filter.label} ×
              </button>
            ))}
            {activeFilters.length === 0 ? (
              <span className="text-sm text-[color:var(--text-muted)]">No active filters.</span>
            ) : null}
          </div>
        </div>

        <CourseSelector searchResults={searchResults} isLoading={isLoading} searchError={searchError} />
      </section>
    </div>
  )
}
