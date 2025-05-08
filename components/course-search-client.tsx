"use client";

import { searchCourseSessions } from "@/app/search";
import { useEffect, useState } from "react";
import { CourseSearchInputs, SearchCriteria } from "./course-search-form";
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
  console.log(searchCriteria);
  useEffect(() => {
    const fetchSearchResults = async () => {
      const searchResults = await searchCourseSessions(
        searchCriteria.textSearch,
        searchCriteria.department,
        searchCriteria.deliveryType,
        searchCriteria.startTime,
        searchCriteria.daysOfWeek,
      );
      console.log(searchResults.length);
    };
    fetchSearchResults();
  }, [searchCriteria]);
  return (
    <div>
      <CourseSearchInputs
        allDepartments={allDepartments}
        searchCriteria={searchCriteria}
        setSearchCriteria={setSearchCriteria}
      />
    </div>
  );
}
