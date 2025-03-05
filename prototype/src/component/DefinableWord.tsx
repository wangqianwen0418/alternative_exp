import React, { useState } from "react";
import { Popover, Paper, IconButton } from "@mui/material";
import QuestionMark from "@mui/icons-material/QuestionMark";

interface DefinableWordProps {
  word: string;
  definition: string;
}

const DefinableWord: React.FC<DefinableWordProps> = ({ word, definition }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <span
        onClick={handleClick}
        style={{
          color: "#1976d2",
          cursor: "pointer",
          textDecoration: "underline",
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        {word}
        <IconButton
          size="small"
          style={{
            padding: "0",
            marginLeft: "-4px",
            position: "relative",
            top: "-0.1em",
            color: "#1976d2",
            cursor: "pointer",
          }}
          onClick={handleClick}
        >
          <QuestionMark fontSize="inherit" />
        </IconButton>
      </span>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Paper style={{ padding: "8px", maxWidth: "250px" }}>
          {definition}
        </Paper>
      </Popover>
    </>
  );
};

export default DefinableWord;
