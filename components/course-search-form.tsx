'use client';

import { Autocomplete, Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';

export interface SearchCriteria {
  textSearch: string;
  department: string;
  deliveryType: string;
  daysOfWeek: string[];
  startTime: string;
}

interface CourseSearchProps {
  allDepartments: string[];
}

export function CourseSearchInputs({
  allDepartments,
}: CourseSearchProps) {
  const [textSearch, setTextSearch] = useState('');
  const [department, setDepartment] = useState("HOSF");
  const [deliveryType, setDeliveryType] = useState('in-person');
  const [daysOfWeek, setDaysOfWeek] = useState({
    monday: false,
    tuesday: true,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [startTime, setStartTime] = useState('evening');
  

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Autocomplete
            disablePortal
            options={allDepartments}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Department" />}
            onChange={(e, value) => setDepartment(value || '')}
          />
        </FormControl>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <Select
            value={deliveryType}
            onChange={(e) => setDeliveryType(e.target.value)}
          >
            <MenuItem value="online">Online</MenuItem>
            <MenuItem value="in-person">In-Person</MenuItem>
            <MenuItem value="both">Both</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: 'flex' }}>
      <FormControl sx={{ m: 7, width: '100%' }} component="fieldset" variant="standard">
        <FormLabel component="legend">Day of the Week</FormLabel>
      <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={daysOfWeek.monday} value="monday" onChange={(e) => setDaysOfWeek({
              ...daysOfWeek,
              monday: e.target.checked,
            })}/>}
            label="Monday"
          />
          <FormControlLabel
            control={<Checkbox checked={daysOfWeek.tuesday} value="tuesday" onChange={(e) => setDaysOfWeek({
              ...daysOfWeek,
              tuesday: e.target.checked,
            })}/>}
            label="Tuesday"
          />
          <FormControlLabel
            control={<Checkbox checked={daysOfWeek.wednesday} value="wednesday" onChange={(e) => setDaysOfWeek({
              ...daysOfWeek,
              wednesday: e.target.checked,
            })}/>}
            label="Wednesday"
          />
          <FormControlLabel
            control={<Checkbox checked={daysOfWeek.thursday} value="thursday" onChange={(e) => setDaysOfWeek({
              ...daysOfWeek,
              thursday: e.target.checked,
            })}/>}
            label="Thursday"
          />
          <FormControlLabel
            control={<Checkbox checked={daysOfWeek.friday} value="friday" onChange={(e) => setDaysOfWeek({
              ...daysOfWeek,
              friday: e.target.checked,
            })}/>}
            label="Friday"
          />
          <FormControlLabel
            control={<Checkbox checked={daysOfWeek.saturday} value="saturday" onChange={(e) => setDaysOfWeek({
              ...daysOfWeek,
              saturday: e.target.checked,
            })}/>}
            label="Saturday"
          />
          <FormControlLabel
            control={<Checkbox checked={daysOfWeek.sunday} value="sunday" onChange={(e) => setDaysOfWeek({
              ...daysOfWeek,
              sunday: e.target.checked,
            })}/>}
            label="Sunday"
          />
        </FormGroup>
        </FormControl>
        </Box>
      <Box display="flex" justifyContent="space-between">
        <FormControl>
          <Select
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          >
            <MenuItem value="morning">Morning (8am-12pm)</MenuItem>
            <MenuItem value="day">Day (12pm-6pm)</MenuItem>
            <MenuItem value="evening">Evening (6pm-10pm)</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}