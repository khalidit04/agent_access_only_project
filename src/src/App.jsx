import { Box, Typography } from '@mui/material';

/**
 * Root application component
 * @returns {JSX.Element}
 */
function App() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Project Restructure Complete
      </Typography>
      <Typography variant="body1" color="text.secondary">
        The nested src/ directory has been eliminated. All source files now live
        directly under <code>src/</code> with clean, standard conventions.
      </Typography>
    </Box>
  );
}

export default App;