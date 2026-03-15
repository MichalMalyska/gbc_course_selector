"use client"

import { type CourseSearchResult } from "@/lib/course-search"
import Link from "next/link"
import { useState } from "react"

type CourseSelectorProps = {
  searchResults: CourseSearchResult[]
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

function truncateText(text: string | null | undefined, maxLength: number) {
  if (!text) {
    return "No description available."
  }

  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength).trimEnd()}...`
}

function scheduleDateRange(result: CourseSearchResult) {
  const { start_date: startDate, end_date: endDate } = result.schedules
  const startLabel = formatScheduleDate(startDate)
  const endLabel = formatScheduleDate(endDate)

  if (!startDate || !endDate || startLabel === endLabel) {
    return startLabel
  }

  return `${startLabel} - ${endLabel}`
}

function scheduleTimeRange(result: CourseSearchResult) {
  const { start_time: startTime, end_time: endTime } = result.schedules

  if (!startTime && !endTime) {
    return "Self-paced / not listed"
  }

  if (startTime && endTime) {
    return `${formatScheduleTime(startTime)} - ${formatScheduleTime(endTime)}`
  }

  return formatScheduleTime(startTime || endTime)
}

function DescriptionBlock({
  description,
  itemId,
  expandedIds,
  toggleExpanded,
  previewLength,
}: {
  description: string | null | undefined
  itemId: number
  expandedIds: number[]
  toggleExpanded: (itemId: number) => void
  previewLength: number
}) {
  const fullText = description || "No description available."
  const isExpanded = expandedIds.includes(itemId)
  const needsToggle = fullText.length > previewLength

  return (
    <div className="space-y-2">
      <p className="text-sm leading-6 text-[color:var(--text-secondary)]">
        {isExpanded ? fullText : truncateText(fullText, previewLength)}
      </p>
      {needsToggle ? (
        <button
          type="button"
          onClick={() => toggleExpanded(itemId)}
          className="text-sm font-medium text-[color:var(--text-primary)] underline underline-offset-4 transition hover:text-[color:var(--accent-strong)]"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      ) : null}
    </div>
  )
}

function buildCourseCode(course: CourseSearchResult["courses"]) {
  if (!course) {
    return "Course"
  }

  return course.course_code || course.course_prefix || "Course"
}

function CourseTitle({
  courseName,
  courseLink,
  className,
}: {
  courseName: string
  courseLink: string | null | undefined
  className: string
}) {
  if (!courseLink) {
    return <p className={className}>{courseName}</p>
  }

  return (
    <Link href={courseLink} target="_blank" rel="noopener noreferrer" className={className}>
      {courseName}
    </Link>
  )
}

function LoadingCards() {
  return (
    <div className="grid gap-4 lg:hidden">
      {[0, 1, 2].map((item) => (
        <div key={item} className="surface-panel rounded-3xl p-5">
          <div className="skeleton-block h-6 w-2/3 rounded-full" />
          <div className="mt-4 skeleton-block h-4 w-1/2 rounded-full" />
          <div className="mt-6 grid gap-3">
            <div className="skeleton-block h-4 w-full rounded-full" />
            <div className="skeleton-block h-4 w-full rounded-full" />
            <div className="skeleton-block h-4 w-5/6 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

function LoadingTable() {
  return (
    <div className="surface-panel hidden overflow-hidden rounded-3xl lg:block">
      <div className="grid grid-cols-[minmax(0,1.2fr)_0.8fr_0.9fr_0.9fr_0.8fr_1.6fr] gap-4 border-b border-[color:var(--border)] bg-[color:var(--surface-muted)] px-6 py-4 text-sm font-semibold text-[color:var(--text-secondary)]">
        <span>Course</span>
        <span>Day</span>
        <span>Time</span>
        <span>Dates</span>
        <span>Delivery</span>
        <span>About</span>
      </div>
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="grid grid-cols-[minmax(0,1.2fr)_0.8fr_0.9fr_0.9fr_0.8fr_1.6fr] gap-4 border-b border-[color:var(--border)] px-6 py-5 last:border-b-0"
        >
          {[0, 1, 2, 3, 4, 5].map((cell) => (
            <div key={cell} className="skeleton-block h-4 rounded-full" />
          ))}
        </div>
      ))}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="surface-panel rounded-3xl px-6 py-12 text-center">
      <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">No matching courses</h3>
      <p className="mt-2 text-sm text-[color:var(--text-secondary)]">{message}</p>
    </div>
  )
}

export default function CourseSelector({ searchResults, isLoading, searchError }: CourseSelectorProps) {
  const [expandedIds, setExpandedIds] = useState<number[]>([])

  const toggleExpanded = (itemId: number) => {
    setExpandedIds((current) =>
      current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId]
    )
  }

  if (isLoading && searchResults.length === 0) {
    return (
      <div className="space-y-4">
        <LoadingCards />
        <LoadingTable />
      </div>
    )
  }

  if (searchError) {
    return <EmptyState message={searchError} />
  }

  if (!searchResults.length) {
    return <EmptyState message="Try clearing a day, time, or department filter." />
  }

  return (
    <div className={`space-y-4 transition ${isLoading ? "opacity-70" : "opacity-100"}`}>
      <div className="grid gap-4 lg:hidden">
        {searchResults.map((result) => {
          const course = result.courses
          const schedule = result.schedules

          return (
            <article key={schedule.id} className="surface-panel rounded-3xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CourseTitle
                    courseName={course?.course_name || "Untitled course"}
                    courseLink={course?.course_link}
                    className="text-lg font-semibold text-[color:var(--text-primary)] underline underline-offset-4"
                  />
                  <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                    {buildCourseCode(course)} • {course?.course_delivery_type || "Delivery not listed"}
                  </p>
                </div>
                <span className="chip">{schedule.day_of_week || "Flexible"}</span>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-4 text-sm text-[color:var(--text-secondary)]">
                <div>
                  <dt className="font-medium text-[color:var(--text-primary)]">Time</dt>
                  <dd className="mt-1">{scheduleTimeRange(result)}</dd>
                </div>
                <div>
                  <dt className="font-medium text-[color:var(--text-primary)]">Dates</dt>
                  <dd className="mt-1">{scheduleDateRange(result)}</dd>
                </div>
              </dl>

              <div className="mt-5 border-t border-[color:var(--border)] pt-4">
                <DescriptionBlock
                  description={course?.course_description}
                  itemId={schedule.id}
                  expandedIds={expandedIds}
                  toggleExpanded={toggleExpanded}
                  previewLength={220}
                />
              </div>
            </article>
          )
        })}
      </div>

      <div className="surface-panel hidden overflow-hidden rounded-3xl lg:block">
        <div className="grid min-w-[1180px] grid-cols-[minmax(0,1.2fr)_0.8fr_0.9fr_0.9fr_0.8fr_1.6fr] gap-4 border-b border-[color:var(--border)] bg-[color:var(--surface-muted)] px-6 py-4 text-sm font-semibold text-[color:var(--text-secondary)]">
          <span>Course</span>
          <span>Day</span>
          <span>Time</span>
          <span>Dates</span>
          <span>Delivery</span>
          <span>About</span>
        </div>

        {searchResults.map((result) => {
          const course = result.courses
          const schedule = result.schedules

          return (
            <div
              key={schedule.id}
              className="grid min-w-[1180px] grid-cols-[minmax(0,1.2fr)_0.8fr_0.9fr_0.9fr_0.8fr_1.6fr] gap-4 border-b border-[color:var(--border)] px-6 py-5 align-top last:border-b-0"
            >
              <div className="min-w-0">
                <CourseTitle
                  courseName={course?.course_name || "Untitled course"}
                  courseLink={course?.course_link}
                  className="block text-base font-semibold text-[color:var(--text-primary)] underline underline-offset-4"
                />
                <p className="mt-2 text-sm text-[color:var(--text-muted)]">{buildCourseCode(course)}</p>
              </div>
              <div className="text-sm text-[color:var(--text-secondary)]">{schedule.day_of_week || "Flexible"}</div>
              <div className="text-sm text-[color:var(--text-secondary)]">{scheduleTimeRange(result)}</div>
              <div className="text-sm text-[color:var(--text-secondary)]">{scheduleDateRange(result)}</div>
              <div className="text-sm text-[color:var(--text-secondary)]">
                {course?.course_delivery_type || "Not listed"}
              </div>
              <DescriptionBlock
                description={course?.course_description}
                itemId={schedule.id}
                expandedIds={expandedIds}
                toggleExpanded={toggleExpanded}
                previewLength={180}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
