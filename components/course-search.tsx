// This component will be used to create a query to search for courses, it takes in user input and returns a set of constraints to be used in the query
// It should allow to search the course by course code, name, description
// It should also allow for filtering by:
// - Delivery Type (Online, In-Person)
// - Day of the week (not exclusive, but selecting "tuesday" will show courses that are only on tuesdays and wont show courses that are on (Tuesday + Thursday))
// - Start Time (morning (8am-12pm), afternoon (12pm-6pm), evening (6pm-8pm))

export default function CourseSearch() {
  return (
    <div>
      <h1>Course Search</h1>
    </div>
  )
}