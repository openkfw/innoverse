import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { User } from '@/common/types';
import theme from '@/styles/theme';
import { openWebex } from '@/utils/openWebex';

import AvatarIcon from '../common/AvatarIcon';
import CustomDialog from '../common/CustomDialog';
import InteractionButton, { InteractionType } from '../common/InteractionButton';
import { StyledTooltip } from '../common/StyledTooltip';

import { TooltipContent } from './TooltipContent';

interface TeamMembersProps {
  team: User[];
  projectName: string;
}

const TeamMembersColumn = (props: TeamMembersProps) => {
  const { team, projectName } = props;
  const [open, setOpen] = useState(false);

  const maxTeamMembers = useMediaQuery(theme.breakpoints.down('md')) ? 8 : 3;
  return (
    <>
      <Typography variant="overline" sx={titleStyles}>
        Unser Team
      </Typography>

      <Card sx={cardStyles} elevation={0}>
        <CardContent sx={cardContentStyles}>
          {team.slice(0, maxTeamMembers).map((teamMember, index) => (
            <Box key={index} sx={rowStyles}>
              <Stack sx={boxStyles} direction="row" spacing={1}>
                <Box>
                  <StyledTooltip
                    arrow
                    key={teamMember.id}
                    title={<TooltipContent projectName={projectName} teamMember={teamMember} />}
                    placement="bottom"
                  >
                    <AvatarIcon user={teamMember} size={24} allowAnimation />
                  </StyledTooltip>
                </Box>
                <Box sx={{ paddingLeft: '16px', ml: '8px' }}>
                  <Typography variant="subtitle2" sx={teamMemberNameStyles}>
                    {teamMember.name}
                  </Typography>
                </Box>
              </Stack>

              <Box sx={iconStyles}>
                <InteractionButton
                  projectName={projectName}
                  interactionType={InteractionType.COMMENT}
                  tooltip="Chat über Webex"
                  onClick={() => openWebex(teamMember.email)}
                />
              </Box>
            </Box>
          ))}

          {team.length > maxTeamMembers && (
            <Button onClick={() => setOpen(true)} sx={showAllButtonStyles}>
              <Typography variant="button" color="action.active">
                Alle anzeigen
              </Typography>
            </Button>
          )}
        </CardContent>
      </Card>

      <CustomDialog open={open} handleClose={() => setOpen(false)} title="Alle Teammitglieder">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {team.map((teamMember, index) => (
            <Stack key={index} sx={rowStyles} spacing={5} direction="row">
              <Stack sx={boxStyles} direction="row" spacing={1}>
                <Box>
                  <StyledTooltip
                    arrow
                    key={teamMember.id}
                    title={<TooltipContent projectName={projectName} teamMember={teamMember} />}
                    placement="bottom"
                  >
                    <AvatarIcon user={teamMember} size={48} allowAnimation />
                  </StyledTooltip>
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ color: 'text.primary', lineHeight: 1, ml: '16px' }}>
                    {teamMember.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mlÍ: '16px' }}>
                    {teamMember.role}
                  </Typography>
                </Box>
              </Stack>

              <Box>
                <InteractionButton
                  projectName={projectName}
                  interactionType={InteractionType.COMMENT}
                  tooltip="Chat über Webex"
                  onClick={() => openWebex(teamMember.email)}
                />
              </Box>
            </Stack>
          ))}
        </Box>
      </CustomDialog>
    </>
  );
};

export default TeamMembersColumn;

// Team Members Column Styles
const titleStyles = {
  textAlign: 'center',
  color: 'primary.light',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
};

const cardStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  borderRadius: '8px',
  background: 'rgba(240, 238, 225, 0.10)',
  border: '1px solid rgba(0, 90, 140, 0.10)',
  mt: 2,
  padding: 0,
  width: '369px',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: '411px',
  },
};

const cardContentStyles = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '100%',
  gap: 1,
  height: 'fit-content',
  maxHeight: '209px',
  [theme.breakpoints.down('md')]: {
    maxHeight: 'unset',
    height: '209px',
  },
};

const rowStyles = {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const teamMemberNameStyles = {
  color: 'text.primary',
  fontSize: '14px',
  lineHeight: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'wrap',
  maxWidth: '23ch',
};

const iconStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 1,
};

const boxStyles = {
  flex: 1,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
};

const showAllButtonStyles = {
  backgroundColor: 'inherit',
  borderRadius: '48px',
  border: '1px solid rgba(0, 0, 0, 0.10)',
  padding: '5px 18px',
  backdropFilter: 'blur(24px)',
  '&:hover': {
    color: 'action.active',
  },
};
