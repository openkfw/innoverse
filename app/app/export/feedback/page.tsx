'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { StatusCodes } from 'http-status-codes';

import { Grid, Stack, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { getFeedback } from '@/app/export/feedback/actions';

const ExportFeedbackPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async () => {
    const feedback = await getFeedback({
      username,
      password,
    });
    if (feedback.status === StatusCodes.UNAUTHORIZED) {
      toast('Invalid credentials!');
      return;
    }
    toast('Feedback should be downloaded now!');
    window.open('data:text/csv;charset=utf-8,' + feedback.data);
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
          <Typography variant="h4">Export Feedback</Typography>
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
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Download Feedback
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ExportFeedbackPage;
