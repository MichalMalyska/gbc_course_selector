"use client"

import { useState } from "react"

type CourseSelectorProps = {
  searchResults: any[]
  isLoading: boolean
  searchError: string | null
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function formatScheduleDate(value: Date | string | null | undefined) {
  if (!value) {
    return "N/A"
  }

  const rawDate = typeof value === "string" ? value.split("T")[0] : value.toISOString().slice(0, 10)
  const [year, month, day] = rawDate.split("-").map(Number)

  if (!year || !month || !day) {
    return "N/A"
  }

  return `${monthNames[month - 1]} ${day}`
}

function formatScheduleTime(value: string | null | undefined) {
  if (!value) {
    return "N/A"
  }

  const [hoursString, minutesString] = value.split(":")
  const hours = Number(hoursString)
  const minutes = Number(minutesString)

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return value
  }

  const period = hours >= 12 ? "PM" : "AM"
  const normalizedHours = hours % 12 || 12

  return `${normalizedHours}:${minutesString.padStart(2, "0")} ${period}`
}

function buildTimeRange(result: any) {
  const startTime = result.schedules.start_time
  const endTime = result.schedules.end_time

  return `${formatScheduleTime(startTime)}${startTime && endTime ? " - " : ""}${endTime ? formatScheduleTime(endTime) : startTime ? "" : "N/A"}`
}

function buildDateRange(result: any) {
  const startDate = result.schedules.start_date
  const endDate = result.schedules.end_date

  return `${formatScheduleDate(startDate)}${startDate && endDate ? " - " : ""}${endDate ? formatScheduleDate(endDate) : startDate ? "" : "N/A"}`
}

function buildCourseCode(result: any) {
  const courseCode = result.courses?.course_code

  if (courseCode) {
    return courseCode
  }

  const prefix = result.courses?.course_prefix
  const number = result.courses?.course_number

  return [prefix, number].filter(Boolean).join(" ")
}

function ResultDescription({ description }: { description: string }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const shouldCollapse = description.length > 220

  return (
    <div className="space-y-3">
      <p
        className={`text-sm leading-7 text-[color:var(--text-secondary)] ${
          shouldCollapse && !isExpanded ? "line-clamp-5" : ""
        }`}
      >
        {description}
      </p>
      {shouldCollapse ? (
        <button
          type="button"
          className="text-sm font-semibold text-[color:var(--text-primary)] underline underline-offset-4 hover:text-[color:var(--accent-strong)]"
          onClick={() => setIsExpanded((currentValue) => !currentValue)}
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      ) : null}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="surface-panel rounded-[1.75rem] p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="skeleton-block h-5 w-40 rounded-full" />
                <div className="skeleton-block h-4 w-24 rounded-full" />
              </div>
              <div className="skeleton-block h-8 w-20 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="skeleton-block h-16 rounded-2xl" />
              <div className="skeleton-block h-16 rounded-2xl" />
              <div className="skeleton-block col-span-2 h-20 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>

      <div className="surface-panel hidden overflow-hidden rounded-[2rem] md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[color:var(--border)]">
            <thead className="bg-[color:var(--surface-muted)]">
              <tr>
                {["Course", "Dept", "Day", "Time", "Dates", "Delivery", "Description"].map((label) => (
                  <th
                    key={label}
                    className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-muted)]"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--border)]">
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: 7 }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-4">
                      <div className="skeleton-block h-4 rounded-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="surface-panel rounded-[2rem] p-10 text-center">
      <div className="mx-auto max-w-md space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--text-muted)]">No matches</p>
        <h3 className="text-2xl font-semibold tracking-tight text-[color:var(--text-primary)]">
          No courses found matching your criteria.
        </h3>
        <p className="text-sm leading-6 text-[color:var(--text-secondary)]">{message}</p>
      </div>
    </div>
  )
}

export default function CourseSelector({ searchResults, isLoading, searchError }: CourseSelectorProps) {
  if (isLoading && !searchResults.length) {
    return <LoadingState />
  }

  if (searchError) {
    return <EmptyState message={searchError} />
  }

  if (!searchResults.length) {
    return <EmptyState message="Try broadening the day, time, or delivery filters to see more results." />
  }

  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:hidden">
        {searchResults.map((result) => (
          <article key={result.schedules.id} className="surface-panel rounded-[1.75rem] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <a
                  href={result.courses?.course_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-semibold leading-6 text-[color:var(--text-primary)] underline-offset-4 hover:text-[color:var(--accent-strong)] hover:underline"
                >
                  {result.courses?.course_name}
                </a>
                <p className="text-xs font-medium text-[color:var(--text-secondary)]">{buildCourseCode(result)}</p>
              </div>
              <span className="chip">{result.courses?.course_delivery_type}</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <div className="surface-muted rounded-2xl p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-muted)]">Day</p>
                <p className="mt-2 text-sm font-medium text-[color:var(--text-primary)]">
                  {result.schedules.day_of_week}
                </p>
              </div>
              <div className="surface-muted rounded-2xl p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-muted)]">Time</p>
                <p className="mt-2 text-sm font-medium text-[color:var(--text-primary)]">{buildTimeRange(result)}</p>
              </div>
              <div className="surface-muted rounded-2xl p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                  Dates
                </p>
                <p className="mt-2 text-sm font-medium text-[color:var(--text-primary)]">{buildDateRange(result)}</p>
              </div>
              <div className="surface-muted rounded-2xl p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                  About
                </p>
                <div className="mt-2">
                  <ResultDescription description={result.courses?.course_description || "No description available."} />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="surface-panel hidden overflow-hidden rounded-[2rem] md:block">
        <div className="overflow-x-auto">
          <table className="min-w-[1180px] w-full table-fixed border-separate border-spacing-0">
            <colgroup>
              <col className="w-[26%]" />
              <col className="w-[11%]" />
              <col className="w-[15%]" />
              <col className="w-[15%]" />
              <col className="w-[12%]" />
              <col className="w-[21%]" />
            </colgroup>
            <thead
              style={{
                background:
                  "linear-gradient(180deg, color-mix(in srgb, var(--surface-muted) 80%, white 20%), var(--surface-muted))",
              }}
            >
              <tr>
                <th className="rounded-tl-[2rem] border-b border-[color:var(--border)] px-6 py-6 text-left text-sm font-semibold text-[color:var(--text-secondary)]">
                  Course
                </th>
                <th className="border-b border-[color:var(--border)] px-6 py-6 text-left text-sm font-semibold text-[color:var(--text-secondary)]">
                  Day
                </th>
                <th className="border-b border-[color:var(--border)] px-6 py-6 text-left text-sm font-semibold text-[color:var(--text-secondary)]">
                  Time
                </th>
                <th className="border-b border-[color:var(--border)] px-6 py-6 text-left text-sm font-semibold text-[color:var(--text-secondary)]">
                  Dates
                </th>
                <th className="border-b border-[color:var(--border)] px-6 py-6 text-left text-sm font-semibold text-[color:var(--text-secondary)]">
                  Delivery
                </th>
                <th className="rounded-tr-[2rem] border-b border-[color:var(--border)] px-6 py-6 text-left text-sm font-semibold text-[color:var(--text-secondary)]">
                  About
                </th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((result) => (
                <tr
                  key={result.schedules.id}
                  className="align-top transition-colors hover:bg-[color:var(--surface-interactive)]"
                >
                  <td className="border-b border-[color:var(--border)] px-6 py-6">
                    <a
                      href={result.courses?.course_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-semibold leading-7 text-[color:var(--text-primary)] underline-offset-4 hover:text-[color:var(--accent-strong)] hover:underline"
                    >
                      {result.courses?.course_name}
                    </a>
                    <p className="mt-1.5 text-sm text-[color:var(--text-muted)]">{buildCourseCode(result)}</p>
                  </td>
                  <td className="border-b border-[color:var(--border)] px-6 py-6 text-base leading-7 text-[color:var(--text-secondary)] whitespace-nowrap">
                    {result.schedules.day_of_week}
                  </td>
                  <td className="border-b border-[color:var(--border)] px-6 py-6 text-base leading-7 text-[color:var(--text-secondary)] whitespace-nowrap">
                    {buildTimeRange(result)}
                  </td>
                  <td className="border-b border-[color:var(--border)] px-6 py-6 text-base leading-7 text-[color:var(--text-secondary)] whitespace-nowrap">
                    {buildDateRange(result)}
                  </td>
                  <td className="border-b border-[color:var(--border)] px-6 py-6 text-base leading-7 text-[color:var(--text-secondary)] whitespace-nowrap">
                    {result.courses?.course_delivery_type}
                  </td>
                  <td className="border-b border-[color:var(--border)] px-6 py-6 align-top">
                    <ResultDescription
                      description={result.courses?.course_description || "No description available."}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
