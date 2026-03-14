export type DayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

export type DeliveryType = "online" | "on-campus" | "any"
export type TimeFilter = "morning" | "afternoon" | "evening" | "any"

export interface DaysOfWeek {
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
}

export interface SearchCriteria {
  textSearch: string
  department: string
  deliveryType: DeliveryType
  daysOfWeek: DaysOfWeek
  startTime: TimeFilter
}

export interface CourseSearchResult {
  courses: {
    id: number
    course_code: string
    course_prefix: string
    course_name: string
    course_delivery_type: string | null
    course_description: string | null
    course_link: string | null
    hours: string | null
    fees: string | null
    prereqs: string | null
  } | null
  schedules: {
    id: number
    start_date: string
    end_date: string
    day_of_week: string | null
    start_time: string | null
    end_time: string | null
  }
}

export const dayOptions: Array<{ key: DayKey; label: string; shortLabel: string }> = [
  { key: "monday", label: "Monday", shortLabel: "Mon" },
  { key: "tuesday", label: "Tuesday", shortLabel: "Tue" },
  { key: "wednesday", label: "Wednesday", shortLabel: "Wed" },
  { key: "thursday", label: "Thursday", shortLabel: "Thu" },
  { key: "friday", label: "Friday", shortLabel: "Fri" },
  { key: "saturday", label: "Saturday", shortLabel: "Sat" },
  { key: "sunday", label: "Sunday", shortLabel: "Sun" },
]

export const deliveryTypeLabels: Record<DeliveryType, string> = {
  any: "Any delivery",
  online: "Online",
  "on-campus": "On Campus",
}

export const timeFilterLabels: Record<TimeFilter, string> = {
  any: "Any time",
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
}

export function createDefaultSearchCriteria(): SearchCriteria {
  return {
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
}
