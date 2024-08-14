import { FormControl, Select, MenuItem } from "@mui/material";

export default function getSelection(
  label: string,
  value: string,
  handleChange: (k: string) => void,
  options: string[]
) {
  return (
    <FormControl
      variant="standard"
      sx={{ m: 1, minWidth: 120, display: "block" }}
    >
      {/* <InputLabel id="demo-simple-select-standard-label">{label}</InputLabel> */}
      <Select
        labelId="demo-simple-select-standard-label"
        id="demo-simple-select-stelandard"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        label="Age"
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
