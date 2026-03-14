import Link from "@mui/material/Link" // For hyperlinking
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"

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

export default function CourseSelector({ searchResults }: { searchResults: any[] }) {
  return (
    <div className="w-full">
      <CourseSearchResults searchResults={searchResults} />
    </div>
  )
}

export function CourseSearchResults({ searchResults }: { searchResults: any[] }) {
  return (
    <TableContainer component={Paper} className="w-11/12 md:w-3/4 mx-auto overflow-x-auto">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Course Name</b>
            </TableCell>
            <TableCell>
              <b>Department</b>
            </TableCell>
            <TableCell>
              <b>Day</b>
            </TableCell>
            <TableCell>
              <b>Time</b>
            </TableCell>
            <TableCell>
              <b>Dates</b>
            </TableCell>
            <TableCell>
              <b>Delivery Type</b>
            </TableCell>
            <TableCell>
              <b>Description</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {searchResults && searchResults.length > 0 ? (
            searchResults.map((result) => (
              <TableRow
                key={result.schedules.id} // Assuming schedules.id is unique
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }} // MUI styling to remove border from last row
              >
                <TableCell component="th" scope="row">
                  <Link href={result.courses?.course_link} target="_blank" rel="noopener noreferrer">
                    {result.courses?.course_name}
                  </Link>
                </TableCell>
                <TableCell>{result.courses?.course_prefix}</TableCell>
                <TableCell>{result.schedules.day_of_week}</TableCell>
                <TableCell>
                  {formatScheduleTime(result.schedules.start_time)}
                  {result.schedules.start_time && result.schedules.end_time ? " - " : ""}
                  {result.schedules.end_time
                    ? formatScheduleTime(result.schedules.end_time)
                    : result.schedules.start_time
                      ? ""
                      : "N/A"}
                </TableCell>
                <TableCell>
                  {formatScheduleDate(result.schedules.start_date)}
                  {result.schedules.start_date && result.schedules.end_date ? " - " : ""}
                  {result.schedules.end_date
                    ? formatScheduleDate(result.schedules.end_date)
                    : result.schedules.start_date
                      ? ""
                      : "N/A"}
                </TableCell>
                <TableCell>{result.courses?.course_delivery_type}</TableCell>
                <TableCell
                  sx={{
                    maxHeight: "100px",
                    overflowY: "auto",
                    display: "block",
                  }}
                >
                  {result.courses?.course_description}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="left">
                <b>No courses found matching your criteria.</b>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
