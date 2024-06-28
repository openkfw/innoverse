import { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { BasicProject } from '@/common/types';
import { TransparentButton } from '@/components/common/TransparentButton';
import * as m from '@/src/paraglide/messages.js';

export const ProjectLinks = ({ projects }: { projects: BasicProject[] }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const visibleProjects = projects.slice(0, isCollapsed ? 3 : undefined);
  const notShownProjectCount = projects.length - visibleProjects.length;

  return (
    <>
      <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
        {m.components_landing_mappingProjectsSection_projectLinks_initiatives()}
      </Typography>
      <Stack spacing={1}>
        {visibleProjects.map((project) => (
          <Link key={project.title} href={`/projects/${project.id}`} style={{ ...linkStyle }}>
            <Typography
              variant="subtitle2"
              key={project.title}
              sx={{
                cursor: 'pointer',
                fontFamily: '***FONT_REMOVED***',
                fontWeight: 700,
                lineHeight: '175%',
                color: 'primary.contrastText',
                '&:hover': {
                  color: 'secondary.main',
                },
              }}
            >
              {project.title}
            </Typography>
          </Link>
        ))}
      </Stack>
      {notShownProjectCount > 0 && (
        <TransparentButton
          startIcon={<AddIcon />}
          sx={expandButtonStyles}
          textSx={expandButtonTextStyles}
          onClick={() => setIsCollapsed(false)}
          disableRipple={true}
        >
          {isCollapsed
            ? `(${notShownProjectCount}) ${m.components_landing_mappingProjectsSection_projectLinks_showMore()}`
            : m.components_landing_mappingProjectsSection_projectLinks_showLess()}
        </TransparentButton>
      )}
    </>
  );
};

export const linkStyle = {
  textDecoration: 'none',
};

const expandButtonStyles = {
  backgroundColor: 'transparent',
  backdropFilter: 'none',
  color: 'white',
  px: 0,
  mb: 0,
  mt: 1,
  '&:hover, &:active': { color: 'white', backgroundColor: 'transparent' },
};

const expandButtonTextStyles = {
  color: 'white',
  '&:hover, &:active': { color: 'white', fontWeight: 700 },
};
