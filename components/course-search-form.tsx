"use client"

import type { Dispatch, SetStateAction } from "react"
import {
  createDefaultSearchCriteria,
  dayOptions,
  deliveryTypeLabels,
  type DayKey,
  type SearchCriteria,
  timeFilterLabels,
} from "@/lib/course-search"

interface CourseSearchProps {
  allDepartments: string[]
  searchCriteria: SearchCriteria
  setSearchCriteria: Dispatch<SetStateAction<SearchCriteria>>
}

function sectionTitle(title: string) {
  return <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--text-muted)]">{title}</h2>
}

export function CourseSearchInputs({ allDepartments, searchCriteria, setSearchCriteria }: CourseSearchProps) {
  const { textSearch, department, deliveryType, daysOfWeek, startTime } = searchCriteria
  const activeDays = dayOptions.filter((day) => daysOfWeek[day.key]).length

  const toggleDay = (dayKey: DayKey) => {
    setSearchCriteria((current) => ({
      ...current,
      daysOfWeek: {
        ...current.daysOfWeek,
        [dayKey]: !current.daysOfWeek[dayKey],
      },
    }))
  }

  return (
    <div className="surface-panel rounded-3xl p-5">
      <div className="flex items-center justify-between gap-3 border-b border-[color:var(--border)] pb-4">
        <h1 className="text-lg font-semibold text-[color:var(--text-primary)]">Filters</h1>
        <button
          type="button"
          onClick={() => setSearchCriteria(createDefaultSearchCriteria())}
          className="button-secondary px-3 py-1.5 text-sm font-medium"
        >
          Reset
        </button>
      </div>

      <div className="mt-5 space-y-6">
        <section className="space-y-2">
          {sectionTitle("Keyword")}
          <label className="block text-sm text-[color:var(--text-secondary)]" htmlFor="course-search">
            Search by course name
          </label>
          <input
            id="course-search"
            type="search"
            value={textSearch}
            placeholder="Knife skills, sushi, baking..."
            onChange={(event) =>
              setSearchCriteria((current) => ({
                ...current,
                textSearch: event.target.value,
              }))
            }
            className="input-base"
          />
        </section>

        <section className="space-y-3">
          {sectionTitle("Department")}
          <label className="block text-sm text-[color:var(--text-secondary)]" htmlFor="department-filter">
            Course area
          </label>
          <select
            id="department-filter"
            value={department}
            onChange={(event) =>
              setSearchCriteria((current) => ({
                ...current,
                department: event.target.value,
              }))
            }
            className="input-base"
          >
            <option value="">All departments</option>
            {allDepartments.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </section>

        <section className="space-y-3">
          {sectionTitle("Delivery")}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {Object.entries(deliveryTypeLabels).map(([value, label]) => {
              const isActive = deliveryType === value

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setSearchCriteria((current) => ({
                      ...current,
                      deliveryType: value as SearchCriteria["deliveryType"],
                    }))
                  }
                  className={`rounded-2xl border px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-[color:var(--text-inverse)] shadow-sm"
                      : "border-[color:var(--border)] bg-[color:var(--surface-muted)] text-[color:var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-panel-strong)]"
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            {sectionTitle("Days")}
            <span className="text-xs font-medium text-[color:var(--text-muted)]">{activeDays} selected</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {dayOptions.map((day) => {
              const isActive = daysOfWeek[day.key]

              return (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => toggleDay(day.key)}
                  className={`rounded-2xl border px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]"
                      : "border-[color:var(--border)] bg-[color:var(--surface-muted)] text-[color:var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-panel-strong)]"
                  }`}
                >
                  {day.shortLabel}
                </button>
              )
            })}
          </div>
        </section>

        <section className="space-y-3">
          {sectionTitle("Time")}
          <label className="block text-sm text-[color:var(--text-secondary)]" htmlFor="time-filter">
            Time of day
          </label>
          <select
            id="time-filter"
            value={startTime}
            onChange={(event) =>
              setSearchCriteria((current) => ({
                ...current,
                startTime: event.target.value as SearchCriteria["startTime"],
              }))
            }
            className="input-base"
          >
            <option value="any">{timeFilterLabels.any}</option>
            <option value="morning">{timeFilterLabels.morning} (8am-12pm)</option>
            <option value="afternoon">{timeFilterLabels.afternoon} (12pm-6pm)</option>
            <option value="evening">{timeFilterLabels.evening} (6pm-10pm)</option>
          </select>
        </section>
      </div>
    </div>
  )
}
