"use client"

import { type CourseSearchResult } from "@/lib/course-search"
import Link from "next/link"
import { useState } from "react"

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
      <p className="text-sm leading-6 text-slate-600">
        {isExpanded ? fullText : truncateText(fullText, previewLength)}
      </p>
      {needsToggle ? (
        <button
          type="button"
          onClick={() => toggleExpanded(itemId)}
          className="text-sm font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-700"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      ) : null}
    </div>
  )
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
        <div
          key={item}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.45)]"
        >
          <div className="h-6 w-2/3 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-4 h-4 w-1/2 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-6 grid gap-3">
            <div className="h-4 w-full animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  )
}

function LoadingTable() {
  return (
    <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white lg:block">
      <div className="grid grid-cols-[minmax(0,1.2fr)_0.8fr_0.9fr_0.9fr_0.8fr_1.6fr] gap-4 border-b border-slate-200 bg-slate-100 px-6 py-4 text-sm font-semibold text-slate-600">
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
          className="grid grid-cols-[minmax(0,1.2fr)_0.8fr_0.9fr_0.9fr_0.8fr_1.6fr] gap-4 border-b border-slate-100 px-6 py-5"
        >
          {[0, 1, 2, 3, 4, 5].map((cell) => (
            <div key={cell} className="h-4 animate-pulse rounded-full bg-slate-200" />
          ))}
        </div>
      ))}
    </div>
  )
}

export default function CourseSelector({
  searchResults,
  isLoading,
}: {
  searchResults: CourseSearchResult[]
  isLoading: boolean
}) {
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

  if (!searchResults.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 px-6 py-12 text-center shadow-[0_20px_45px_-35px_rgba(15,23,42,0.35)]">
        <h3 className="text-lg font-semibold text-slate-900">No matching courses</h3>
        <p className="mt-2 text-sm text-slate-500">Try clearing a day, time, or department filter.</p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 transition ${isLoading ? "opacity-70" : "opacity-100"}`}>
      <div className="grid gap-4 lg:hidden">
        {searchResults.map((result) => {
          const course = result.courses
          const schedule = result.schedules

          return (
            <article
              key={schedule.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.45)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CourseTitle
                    courseName={course?.course_name || "Untitled course"}
                    courseLink={course?.course_link}
                    className="text-lg font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4"
                  />
                  <p className="mt-1 text-sm text-slate-500">
                    {course?.course_code || course?.course_prefix || "Course"} •{" "}
                    {course?.course_delivery_type || "Delivery not listed"}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {schedule.day_of_week || "Flexible"}
                </span>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-4 text-sm text-slate-600">
                <div>
                  <dt className="font-medium text-slate-900">Time</dt>
                  <dd className="mt-1">{scheduleTimeRange(result)}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Dates</dt>
                  <dd className="mt-1">{scheduleDateRange(result)}</dd>
                </div>
              </dl>

              <div className="mt-5 border-t border-slate-100 pt-4">
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

      <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_-45px_rgba(15,23,42,0.45)] lg:block">
        <div className="grid grid-cols-[minmax(0,1.2fr)_0.8fr_0.9fr_0.9fr_0.8fr_1.6fr] gap-4 border-b border-slate-200 bg-slate-100 px-6 py-4 text-sm font-semibold text-slate-600">
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
              className="grid grid-cols-[minmax(0,1.2fr)_0.8fr_0.9fr_0.9fr_0.8fr_1.6fr] gap-4 border-b border-slate-100 px-6 py-5 align-top last:border-b-0"
            >
              <div className="min-w-0">
                <CourseTitle
                  courseName={course?.course_name || "Untitled course"}
                  courseLink={course?.course_link}
                  className="block text-base font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4"
                />
                <p className="mt-2 text-sm text-slate-500">
                  {course?.course_code || course?.course_prefix || "Course"}
                </p>
              </div>
              <div className="text-sm text-slate-700">{schedule.day_of_week || "Flexible"}</div>
              <div className="text-sm text-slate-700">{scheduleTimeRange(result)}</div>
              <div className="text-sm text-slate-700">{scheduleDateRange(result)}</div>
              <div className="text-sm text-slate-700">{course?.course_delivery_type || "Not listed"}</div>
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
