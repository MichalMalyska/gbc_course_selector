"use client";

import { searchCourseSessions } from "@/app/search";
import { useEffect, useState } from "react";
import { CourseSearchInputs, SearchCriteria } from "./course-search-form";
import CourseSelector from "./course-selector";
export function CourseSearchClient({
  allDepartments,
}: {
  allDepartments: string[];
}) {
  const [textSearch, setTextSearch] = useState("");
  const [department, setDepartment] = useState("HOSF");
  const [deliveryType, setDeliveryType] = useState("on-campus");
  const [daysOfWeek, setDaysOfWeek] = useState({
    monday: false,
    tuesday: true,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [startTime, setStartTime] = useState("evening");
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    textSearch,
    department,
    deliveryType,
    daysOfWeek,
    startTime,
  });
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      const results = await searchCourseSessions(
        searchCriteria.textSearch,
        searchCriteria.department,
        searchCriteria.deliveryType,
        searchCriteria.startTime,
        searchCriteria.daysOfWeek,
      );
      setSearchResults(results);
      console.log(results.length);
    };
    fetchSearchResults();
  }, [searchCriteria]);
  return (
    <>
      <div>
        <CourseSearchInputs
          allDepartments={allDepartments}
          searchCriteria={searchCriteria}
          setSearchCriteria={setSearchCriteria}
        />
      </div>
      <div>
        <CourseSelector searchResults={searchResults} />
      </div>
    </>
  );
}
