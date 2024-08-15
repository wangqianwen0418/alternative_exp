import { FormControl, Select, MenuItem } from "@mui/material";
import React from "react";

type Props = {
    label: string;
    value: string | number | undefined;
    handleChange: any;
    options: (string | number)[];
};

export default function Selection(props: Props): JSX.Element {
    const { label, value, handleChange, options } = props;
    return (
        <FormControl
            variant="standard"
            sx={{ m: 1, minWidth: 120 }}
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
