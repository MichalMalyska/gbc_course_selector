"use client";

import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

export interface SearchCriteria {
  textSearch: string;
  department: string;
  deliveryType: string;
  daysOfWeek: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  startTime: string;
}

interface CourseSearchProps {
  allDepartments: string[];
  searchCriteria: SearchCriteria;
  setSearchCriteria: (searchCriteria: SearchCriteria) => void;
}

export function CourseSearchInputs({
  allDepartments,
  searchCriteria,
  setSearchCriteria,
}: CourseSearchProps) {
  const { textSearch, department, deliveryType, daysOfWeek, startTime } =
    searchCriteria;
  return (
    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <TextField
          label="Search Courses by Name"
          value={textSearch}
          onChange={(e) =>
            setSearchCriteria({ ...searchCriteria, textSearch: e.target.value })
          }
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <Autocomplete
            disablePortal
            options={allDepartments}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Department" />
            )}
            value={department}
            onChange={(e, value) => {
              setSearchCriteria({ ...searchCriteria, department: value || "" });
            }}
          />
        </FormControl>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <Select
            value={deliveryType}
            onChange={(e) =>
              setSearchCriteria({
                ...searchCriteria,
                deliveryType: e.target.value,
              })
            }
          >
            <MenuItem value="online">Online</MenuItem>
            <MenuItem value="on-campus">On Campus</MenuItem>
            <MenuItem value="both">Both</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: "flex" }}>
        <FormControl
          sx={{ m: 7, width: "100%" }}
          component="fieldset"
          variant="standard"
        >
          <FormLabel component="legend">Day of the Week</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={daysOfWeek.monday}
                  value="monday"
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      daysOfWeek: {
                        ...daysOfWeek,
                        monday: e.target.checked,
                      },
                    })
                  }
                />
              }
              label="Monday"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={daysOfWeek.tuesday}
                  value="tuesday"
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      daysOfWeek: {
                        ...daysOfWeek,
                        tuesday: e.target.checked,
                      },
                    })
                  }
                />
              }
              label="Tuesday"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={daysOfWeek.wednesday}
                  value="wednesday"
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      daysOfWeek: {
                        ...daysOfWeek,
                        wednesday: e.target.checked,
                      },
                    })
                  }
                />
              }
              label="Wednesday"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={daysOfWeek.thursday}
                  value="thursday"
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      daysOfWeek: {
                        ...daysOfWeek,
                        thursday: e.target.checked,
                      },
                    })
                  }
                />
              }
              label="Thursday"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={daysOfWeek.friday}
                  value="friday"
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      daysOfWeek: {
                        ...daysOfWeek,
                        friday: e.target.checked,
                      },
                    })
                  }
                />
              }
              label="Friday"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={daysOfWeek.saturday}
                  value="saturday"
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      daysOfWeek: {
                        ...daysOfWeek,
                        saturday: e.target.checked,
                      },
                    })
                  }
                />
              }
              label="Saturday"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={daysOfWeek.sunday}
                  value="sunday"
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      daysOfWeek: {
                        ...daysOfWeek,
                        sunday: e.target.checked,
                      },
                    })
                  }
                />
              }
              label="Sunday"
            />
          </FormGroup>
        </FormControl>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <FormControl>
          <Select
            value={startTime}
            onChange={(e) =>
              setSearchCriteria({
                ...searchCriteria,
                startTime: e.target.value,
              })
            }
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
