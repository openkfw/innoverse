'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Option } from '@/common/formTypes';
import { Project } from '@/common/types';
import { getProjectsOptions } from '@/utils/requests/project/requests';

import InteractionButton, { interactionButtonStyles, InteractionType } from '../common/InteractionButton';
import AddUpdateDialog from '../newsPage/addUpdate/AddUpdateDialog';

interface AddUpdateCardProps {
  project: Project;
  refetchUpdates: () => void;
  text: string;
  wrapSx?: SxProps;
  cardSx?: SxProps;
}

export const AddUpdateCard = (props: AddUpdateCardProps) => {
  const { project, refetchUpdates, text, wrapSx, cardSx } = props;
  const [addUpdateDialogOpen, setAddUpdateDialogOpen] = useState(false);
  const [projectOptions, setProjectOptions] = useState<Option[]>([]);

  const handleAddUpdate = async () => {
    const projectOptions = await getProjectsOptions();
    setProjectOptions(projectOptions);
    setAddUpdateDialogOpen(true);
  };

  const defaultFormValues = {
    comment: '',
    author: '',
    project: { id: project.id, label: project.title },
  };

  return (
    <Box sx={wrapSx}>
      <Card sx={{ ...cardStyles, ...cardSx }} elevation={0}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="body1" color="secondary.contrastText" sx={{ pb: 2 }}>
            {text}
          </Typography>
          <InteractionButton
            onClick={() => handleAddUpdate()}
            interactionType={InteractionType.ADD_UPDATE}
            sx={{ ...interactionButtonStyles, ...buttonStyle }}
          />
        </CardContent>
      </Card>
      <AddUpdateDialog
        open={addUpdateDialogOpen}
        setOpen={setAddUpdateDialogOpen}
        refetchUpdates={refetchUpdates}
        defaultFormValues={defaultFormValues}
        projectOptions={projectOptions}
      />
    </Box>
  );
};

const cardStyles = {
  height: 'fit-content',
  borderRadius: '8px',
  background: 'linear-gradient(90deg, #FAF9F7 0%, #F6F5ED 100%)',
};

const buttonStyle = {
  borderRadius: '50px',
  backgroundColor: 'secondary.main',
  height: ' 48px',
  fontSize: '18px',
  boxShadow: 'none',
  maxWidth: '240px',
};
