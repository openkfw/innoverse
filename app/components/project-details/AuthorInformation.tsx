import Image from 'next/image';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { User } from '@/common/types';
import { openWebex } from '@/utils/openWebex';

import InteractionButton, { InteractionButtonProps, InteractionType } from '../common/InteractionButton';

import { StyledTooltip } from '../common/StyledTooltip';
import { TooltipContent } from './TooltipContent';
import AvatarIcon from '../common/AvatarIcon';

interface AuthorInformationProps {
  author: User;
  projectName: string;
}

export const AuthorInformation = (props: AuthorInformationProps) => {
  const { author, projectName } = props;

  const InteractionButtonWrapper = (props: InteractionButtonProps) => (
    <div style={{ margin: 0 }}>
      <InteractionButton {...props} />
    </div>
  );

  return (
    <Stack direction="row" justifyContent="space-between" flexWrap={'wrap'} pt={4}>
      <Stack direction="column" sx={{ marginRight: 3 }}>
        <Stack direction="row" spacing={1} sx={{ marginBottom: 1 }}>
          <Box>
            <StyledTooltip
              arrow
              key={author.id}
              title={<TooltipContent projectName={projectName} teamMember={author} />}
              placement="bottom"
            >
              <AvatarIcon user={author} size={48} allowAnimation/>
            </StyledTooltip>
          </Box>
          <Box>
            <Typography variant="subtitle1" color="text.primary" sx={{ m: "16px" }}>
              {author.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {author.role}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" alignItems="center" pb={2} spacing={1} sx={{ m: 0 }} mt={2}>
          <Typography variant="caption" color="text.primary">
            {author.department}
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="row" spacing={1} flexWrap={'wrap'} sx={{ mb: 2 }}>
        <InteractionButtonWrapper
          projectName={projectName}
          interactionType={InteractionType.USER_FOLLOW}
          onClick={() => openWebex(author.email)} //todo: add following
          sx={{ mb: 1 }}
        />
        <InteractionButton
          projectName={projectName}
          interactionType={InteractionType.COMMENT}
          tooltip="Chat über Webex"
          onClick={() => openWebex(author.email)}
          sx={{ mb: 1, mr: 1 }}
        />
      </Stack>
    </Stack>
  );
};
