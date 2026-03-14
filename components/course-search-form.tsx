"use client"

export interface SearchCriteria {
  textSearch: string
  department: string
  deliveryType: string
  daysOfWeek: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
  }
  startTime: string
}

interface CourseSearchProps {
  allDepartments: string[]
  searchCriteria: SearchCriteria
  setSearchCriteria: (searchCriteria: SearchCriteria) => void
}

const defaultSearchCriteria: SearchCriteria = {
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

const dayOptions = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" },
] as const

export function CourseSearchInputs({ allDepartments, searchCriteria, setSearchCriteria }: CourseSearchProps) {
  const { textSearch, department, deliveryType, daysOfWeek, startTime } = searchCriteria

  return (
    <section className="surface-panel rounded-[2rem] p-5 sm:p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-[color:var(--text-primary)]">Filters</h2>
          <p className="text-sm leading-6 text-[color:var(--text-secondary)]">
            Narrow the list by course details, schedule, and delivery type.
          </p>
        </div>
        <button
          type="button"
          className="button-secondary px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em]"
          onClick={() => setSearchCriteria(defaultSearchCriteria)}
        >
          Reset
        </button>
      </div>

      <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--text-primary)]" htmlFor="text-search">
            Course name
          </label>
          <input
            id="text-search"
            className="input-base"
            placeholder="Search by course title"
            value={textSearch}
            onChange={(event) => setSearchCriteria({ ...searchCriteria, textSearch: event.target.value })}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[color:var(--text-primary)]" htmlFor="department">
              Department
            </label>
            <select
              id="department"
              className="input-base"
              value={department}
              onChange={(event) =>
                setSearchCriteria({
                  ...searchCriteria,
                  department: event.target.value,
                })
              }
            >
              {allDepartments.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[color:var(--text-primary)]" htmlFor="delivery-type">
              Delivery type
            </label>
            <select
              id="delivery-type"
              className="input-base"
              value={deliveryType}
              onChange={(event) =>
                setSearchCriteria({
                  ...searchCriteria,
                  deliveryType: event.target.value,
                })
              }
            >
              <option value="online">Online</option>
              <option value="on-campus">On campus</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--text-primary)]" htmlFor="start-time">
            Start time
          </label>
          <select
            id="start-time"
            className="input-base"
            value={startTime}
            onChange={(event) =>
              setSearchCriteria({
                ...searchCriteria,
                startTime: event.target.value,
              })
            }
          >
            <option value="morning">Morning (8am - 12pm)</option>
            <option value="afternoon">Day (12pm - 6pm)</option>
            <option value="evening">Evening (6pm - 10pm)</option>
          </select>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-[color:var(--text-primary)]">Days of the week</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
            {dayOptions.map((day) => {
              const isActive = daysOfWeek[day.key]

              return (
                <button
                  key={day.key}
                  type="button"
                  className={`rounded-2xl border px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]"
                      : "border-[color:var(--border)] bg-[color:var(--surface-panel-strong)] text-[color:var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-interactive)]"
                  }`}
                  onClick={() =>
                    setSearchCriteria({
                      ...searchCriteria,
                      daysOfWeek: {
                        ...daysOfWeek,
                        [day.key]: !daysOfWeek[day.key],
                      },
                    })
                  }
                >
                  {day.label}
                </button>
              )
            })}
          </div>
        </fieldset>
      </form>
    </section>
  )
}
