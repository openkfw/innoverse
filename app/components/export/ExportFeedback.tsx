'use client';

import React, { useState } from 'react';
import { StatusCodes } from 'http-status-codes';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { generatePlatformStatistics, generateProjectsStatistics } from '@/app/export/actions';
import { errorMessage, infoMessage } from '@/components/common/CustomToast';
import { getFeedback } from '@/utils/requests/statistics/requests';

const ExportFeedback = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleDownloadPlatformFeedback = async () => {
    const feedback = await getFeedback({
      username,
      password,
    });
    if (feedback.status === StatusCodes.UNAUTHORIZED) {
      errorMessage({ message: 'Invalid credentials!' });
      return;
    }
    infoMessage({ message: 'Feedback should be downloaded now!' });
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + feedback.data;
    link.download = 'platform_feedback.csv';
    link.click();
  };

  const handleDownloadOverallStats = async () => {
    const platformStats = await generatePlatformStatistics({
      username,
      password,
    });
    if (platformStats.status === StatusCodes.UNAUTHORIZED) {
      errorMessage({ message: 'Invalid credentials!' });
      return;
    }
    infoMessage({ message: 'Platform statistics should be downloaded now!' });
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + platformStats.data;
    link.download = 'overall_platform_statistics.csv';
    link.click();
  };

  const handleDownloadProjectStats = async () => {
    const projectStats = await generateProjectsStatistics({
      username,
      password,
    });
    if (projectStats.status === StatusCodes.UNAUTHORIZED) {
      errorMessage({ message: 'Invalid credentials!' });
      return;
    }
    infoMessage({ message: 'Project statistics should be downloaded now!' });
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + projectStats.data;
    link.download = 'project_statistics.csv';
    link.click();
  };

  return (
    <>
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
        <Button variant="contained" color="primary" onClick={handleDownloadPlatformFeedback}>
          Download Platform Feedbacks
        </Button>
        <Button variant="contained" color="primary" onClick={handleDownloadOverallStats}>
          Download Overall Statistics
        </Button>
        <Button variant="contained" color="primary" onClick={handleDownloadProjectStats}>
          Download Statistics for Projects
        </Button>
      </Stack>
    </>
  );
};

export default ExportFeedback;
