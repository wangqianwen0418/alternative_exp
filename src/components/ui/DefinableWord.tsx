import React, { useState } from 'react';
import { Popover, Paper, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

interface DefinableWordProps {
  word: string;
  definition: string;
}

export default function DefinableWord({
  word,
  definition,
}: DefinableWordProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isOpen = Boolean(anchorEl);

  return (
    <>
      <span
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        style={{
          color: '#1976d2',
          cursor: 'pointer',
          textDecoration: 'underline',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        {word}
        <IconButton
          size="small"
          sx={{
            p: 0,
            ml: '2px',
            color: '#1976d2',
          }}
          aria-label={`Definition of ${word}`}
          onClick={handleOpen}
        >
          <InfoIcon fontSize="inherit" />
        </IconButton>
      </span>

      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Paper sx={{ p: 1, maxWidth: 250 }}>{definition}</Paper>
      </Popover>
    </>
  );
}
