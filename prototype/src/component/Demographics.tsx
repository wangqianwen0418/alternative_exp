import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
} from "@mui/material";
//import { useTheme } from "@mui/material/styles";

export interface DemographicsData {
  age: number;
  gender: string;
  educationLevel: string;
  occupation: string;
  mlExperience: number;
}

interface DemographicsProps {
  show: boolean;
  onSubmit: (data: DemographicsData) => void;
}

export default function Demographics({ show, onSubmit }: DemographicsProps) {
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [otherGender, setOtherGender] = useState<string>("");
  const [educationLevel, setEducationLevel] = useState<string>("");
  const [occupation, setOccupation] = useState<string>("");
  const [mlExperience, setMlExperience] = useState<string>("");

  const isFormValid = () => {
    if (!age || !gender || !educationLevel || !occupation || !mlExperience)
      return false;
    if (gender === "Other" && !otherGender) return false;
    return true;
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      return;
    }
    const demographicsData: DemographicsData = {
      age: Number(age),
      gender: gender === "Other" ? otherGender : gender,
      educationLevel,
      occupation,
      mlExperience: Number(mlExperience),
    };
    onSubmit(demographicsData);
  };

  return (
    <Modal
      open={show}
      onClose={() => {}}
      closeAfterTransition
      aria-labelledby="demographics-modal-title"
      aria-describedby="demographics-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "40vw",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxHeight: "85vh",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Typography id="demographics-modal-title" variant="h6" gutterBottom>
          Demographic Information
        </Typography>

        <Grid container spacing={2}>
          {/* Age */}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </Grid>

          {/* Gender */}
          <Grid item xs={12}>
            <TextField
              select
              required
              fullWidth
              label="Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Non-binary">Non-binary</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>
          {gender === "Other" && (
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Please specify"
                value={otherGender}
                onChange={(e) => setOtherGender(e.target.value)}
              />
            </Grid>
          )}

          {/* Education */}
          <Grid item xs={12}>
            <TextField
              select
              required
              fullWidth
              label="Highest level of education completed"
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
            >
              <MenuItem value="HS graduation">HS graduation</MenuItem>
              <MenuItem value="Bachelors degree">Bachelors degree</MenuItem>
              <MenuItem value="Masters degree">Masters degree</MenuItem>
              <MenuItem value="PhD">PhD</MenuItem>
            </TextField>
          </Grid>

          {/* Occupation */}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Occupation"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
          </Grid>

          {/* ML Experience */}
          <Grid item xs={12}>
            <TextField
              select
              required
              fullWidth
              label="ML Experience (1-6)"
              value={mlExperience}
              onChange={(e) => setMlExperience(e.target.value)}
              helperText="1 = No experience, 6 = Expert"
            >
              {[1, 2, 3, 4, 5, 6].map((val) => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, textAlign: "right" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!isFormValid()}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
