'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { StatusCodes } from 'http-status-codes';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { generatePlatformStatistics, generateProjectsStatistics, getFeedback } from '@/app/export/actions';

const ExportFeedbackPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const downloadPlatformFeedback = async () => {
    const feedback = await getFeedback({
      username,
      password,
    });
    if (feedback.status === StatusCodes.UNAUTHORIZED) {
      toast('Invalid credentials!');
      return;
    }
    toast('Feedback should be downloaded now!');
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + feedback.data;
    link.download = 'platform_feedback.csv';
    link.click();
  };

  const downloadOverallStats = async () => {
    const platformStats = await generatePlatformStatistics({
      username,
      password,
    });
    if (platformStats.status === StatusCodes.UNAUTHORIZED) {
      toast('Invalid credentials!');
      return;
    }
    toast('Platform statistics  should be downloaded now!');
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + platformStats.data;
    link.download = 'overall_platform_statistics.csv';
    link.click();
  };

  const downloadProjectStats = async () => {
    const projectStats = await generateProjectsStatistics({
      username,
      password,
    });
    if (projectStats.status === StatusCodes.UNAUTHORIZED) {
      toast('Invalid credentials!');
      return;
    }
    toast('Project statistics should be downloaded now!');
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + projectStats.data;
    link.download = 'project_statistics.csv';
    link.click();
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: '100vh',
      }}
    >
      <Grid item xs={3}>
        <Stack spacing={3}>
          <Typography variant="h4">Export</Typography>
          <TextField
            inputProps={{ style: { color: 'white' } }}
            label="Username"
            value={username}
            onChange={handleUsernameChange}
          />
          <TextField
            inputProps={{ style: { color: 'white' } }}
            label="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <Stack spacing={'10px'}>
            <Button variant="contained" color="primary" onClick={downloadPlatformFeedback}>
              Download Platform Feedbacks
            </Button>
            <Button variant="contained" color="primary" onClick={downloadOverallStats}>
              Download Overall Statistics
            </Button>
            <Button variant="contained" color="primary" onClick={downloadProjectStats}>
              Download Statistics for Projects
            </Button>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ExportFeedbackPage;
