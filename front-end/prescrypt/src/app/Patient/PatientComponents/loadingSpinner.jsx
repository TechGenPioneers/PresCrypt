// components/LoadingSpinner.jsx
import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { green } from '@mui/material/colors';

export default function LoadingSpinner() {
  const [progress, setProgress] = React.useState(0);
  const [buffer, setBuffer] = React.useState(10);

  const progressRef = React.useRef(() => {});

  React.useEffect(() => {
    progressRef.current = () => {
      if (progress === 100) {
        setProgress(0);
        setBuffer(10);
      } else {
        setProgress((prev) => prev + 1);
        if (buffer < 100 && progress % 5 === 0) {
          const newBuffer = buffer + 1 + Math.random() * 10;
          setBuffer(newBuffer > 100 ? 100 : newBuffer);
        }
      }
    };
  }, [progress, buffer]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current();
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box
      sx={{
        width: '80%',
        mx: 'auto',
        mt: 4,
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2, color: green[900], fontWeight: 'bold' }}
      >
        Hang tight, we are working on it...
      </Typography>
      <LinearProgress
        variant="buffer"
        value={progress}
        valueBuffer={buffer}
        sx={{
          height: 10,
          borderRadius: 5,
          backgroundColor: green[100],
          '& .MuiLinearProgress-bar': {
            backgroundColor: green[700],
          },
          '& .MuiLinearProgress-barBuffer': {
            backgroundColor: green[300],
          },
        }}
      />
    </Box>
  );
}
