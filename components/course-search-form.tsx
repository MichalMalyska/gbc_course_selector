'use client';

import { useState } from 'react';

export interface SearchCriteria {
  textSearch: string;
  department: string;
  deliveryType: string;
  dayOfWeek: string;
  startTime: string;
}

interface CourseSearchProps {
  allDepartments: string[];
  initialCriteria?: Partial<SearchCriteria>;
}

export function CourseSearchInputs({
  allDepartments,
  initialCriteria,
}: CourseSearchProps) {
  const [textSearch, setTextSearch] = useState(initialCriteria?.textSearch || '');
  const [department, setDepartment] = useState(initialCriteria?.department || "HOSF");
  const [deliveryType, setDeliveryType] = useState(initialCriteria?.deliveryType || 'in-person');
  const [dayOfWeek, setDayOfWeek] = useState(initialCriteria?.dayOfWeek || 'tuesday');
  const [startTime, setStartTime] = useState(initialCriteria?.startTime || 'evening');
  
  
  return (
    <div>
      <h1>Course Search</h1>
      <label>
        Text Search Code:
        <input
          type="text"
          value={textSearch}
          onChange={(e) => setTextSearch(e.target.value)}
        />
      </label>
      <label>
        Department:
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          {allDepartments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </label>
      <label>
        Delivery Type:
        <select
          value={deliveryType}
          onChange={(e) => setDeliveryType(e.target.value)}
        >
          <option value="online">Online</option>
          <option value="in-person">In-Person</option>
          <option value="both">Both</option>
        </select>
      </label>
      <label>
        Day of the Week:
        <select
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(e.target.value)}
        >
          <option value="monday">Monday</option>
          <option value="tuesday">Tuesday</option>
          <option value="wednesday">Wednesday</option>
          <option value="thursday">Thursday</option>
          <option value="friday">Friday</option>
          <option value="saturday">Saturday</option>
          <option value="sunday">Sunday</option>
        </select>
      </label>
      <label>
        Start Time:
        <select
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        >
          <option value="morning">Morning (8am-12pm)</option>
          <option value="day">Day (12pm-6pm)</option>
          <option value="evening">Evening (6pm-10pm)</option>
        </select>
      </label>
    </div>
  );
}