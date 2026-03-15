export default function CourseSelectorPlaceholder() {
  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
      <section className="surface-panel rounded-[2rem] p-5 sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="skeleton-block h-5 w-24 rounded-full" />
            <div className="skeleton-block h-4 w-44 rounded-full" />
          </div>
          <div className="skeleton-block h-10 w-20 rounded-full" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="skeleton-block h-4 w-24 rounded-full" />
              <div className="skeleton-block h-11 rounded-2xl" />
            </div>
          ))}
          <div className="space-y-3 pt-2">
            <div className="skeleton-block h-4 w-32 rounded-full" />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="skeleton-block h-10 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="surface-panel rounded-[2rem] p-5 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <div className="skeleton-block h-4 w-20 rounded-full" />
              <div className="skeleton-block h-8 w-52 rounded-full" />
              <div className="skeleton-block h-4 w-36 rounded-full" />
            </div>
            <div className="skeleton-block h-14 w-36 rounded-[1.5rem]" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="skeleton-block h-8 w-28 rounded-full" />
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="surface-panel rounded-[1.75rem] p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="skeleton-block h-5 w-36 rounded-full" />
                  <div className="skeleton-block h-4 w-20 rounded-full" />
                </div>
                <div className="skeleton-block h-8 w-20 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="skeleton-block h-16 rounded-2xl" />
                <div className="skeleton-block h-16 rounded-2xl" />
                <div className="skeleton-block h-16 rounded-2xl" />
                <div className="skeleton-block h-16 rounded-2xl" />
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
                {Array.from({ length: 5 }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
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
      </section>
    </div>
  )
}
