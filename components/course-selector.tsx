export default function CourseSelector({
  searchResults,
}: {
  searchResults: any[];
}) {
  return (
    <div>
      <CourseSearchResults searchResults={searchResults} />
    </div>
  );
}

export function CourseSearchResults({
  searchResults,
}: {
  searchResults: any[];
}) {
  if (!searchResults || searchResults.length === 0) {
    return <p>No courses found matching your criteria.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Course Name</th>
          <th>Department</th>
          <th>Day</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Delivery Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {searchResults.map((result) => (
          <tr key={result.schedules.id}>
            <td>
              <a
                href={result.courses?.course_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {result.courses?.course_name}
              </a>
            </td>
            <td>{result.courses?.course_prefix}</td>
            <td>{result.schedules.day_of_week}</td>
            <td>{result.schedules.start_time}</td>
            <td>{result.schedules.end_time}</td>
            <td>{result.courses?.course_delivery_type}</td>
            <td>{result.courses?.course_description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
