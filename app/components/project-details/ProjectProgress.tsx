'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import MuiMarkdown, { getOverrides, Overrides } from 'mui-markdown';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Box, Collapse, Divider, Grid, IconButton, Link, List, ListItemButton, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';

import triggerAnalyticsEvent from '@/analytics/analytics';
import { Project, ProjectDescription } from '@/common/types';

import { AuthorInformation } from './AuthorInformation';
import CommentsSection from './CommentsSection';
import { ProjectTags } from './ProjectTags';

import robotic_hand from '/public/images/robotic-hand.png';

interface MarkdownHeading {
  title: string;
  depth: number;
  id: string;
  active: boolean;
}

interface ProjectProgressProps {
  project: Project;
  projectName: string;
}

interface InfoItemProps {
  description: ProjectDescription;
}

interface ProjectTextProps {
  showMoreButtonVisible: boolean;
  text: string;
}

interface ProjectTextAnchorMenuProps {
  headings: MarkdownHeading[] | undefined;
  setHeadingActive: (id: string) => void;
}

interface ProjectTextProps {
  showMoreButtonVisible: boolean;
  text: string;
}

const InfoItemRight = ({ description }: InfoItemProps) => {
  return (
    <Card sx={infoItemRightStyles} elevation={0}>
      <CardContent sx={{ p: '18px', pb: 1 }}>
        <Typography variant="subtitle1" color="text.primary" sx={{ textTransform: 'uppercase' }}>
          {description.title}
        </Typography>
      </CardContent>
      <Divider sx={dividerStyle} />

      <CardMedia sx={{ display: 'flex', justifyContent: 'center' }}>
        <Image src={robotic_hand} alt="image" width={235} height={130} />
      </CardMedia>
      <CardContent sx={{ p: '18px' }}>
        <Typography variant="subtitle2" color="text.primary">
          {description.summary}
        </Typography>
      </CardContent>
    </Card>
  );
};

const ProjectText = (props: ProjectTextProps) => (
  <Box
    id="main-text"
    sx={{
      overflowY: props.showMoreButtonVisible ? 'none' : 'scroll',
      height: '800px',
      scrollBehavior: 'smooth',
    }}
  >
    <MuiMarkdown overrides={muiMarkdownOverrides as Overrides}>{props.text}</MuiMarkdown>
  </Box>
);

const ProjectTextAnchorMenu = (props: ProjectTextAnchorMenuProps) => {
  return (
    <Box>
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        {props.headings?.map((heading) => {
          if (heading.depth > 1) {
            return (
              <Collapse in timeout="auto" unmountOnExit key={heading.id}>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }} onClick={() => props.setHeadingActive(heading.id)}>
                    <Link
                      color={heading.active ? 'secondary.main' : 'primary.main'}
                      href={`#${heading.id}`}
                      variant="body2"
                      underline="none"
                    >
                      {heading.title}
                    </Link>
                  </ListItemButton>
                </List>
              </Collapse>
            );
          }
          return (
            <ListItemButton key={heading.id} onClick={() => props.setHeadingActive(heading.id)}>
              <Link
                color={heading.active ? 'secondary.main' : 'primary.main'}
                href={`#${heading.id}`}
                variant="body2"
                underline="none"
              >
                {heading.title}
              </Link>
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
};

export const ProjectProgress = (props: ProjectProgressProps) => {
  const { project, projectName } = props;
  const [contentSize, setContentSize] = useState<string>('600px');
  const [showMoreButtonVisible, setShowMoreButtonVisible] = useState<boolean>(true);
  const [headings, setHeadings] = useState<MarkdownHeading[] | undefined>();

  const expand = () => {
    triggerAnalyticsEvent('expand-project-description', projectName);
    setContentSize('100%');
    setShowMoreButtonVisible(false);
  };

  const generateLinkMarkup = (contentElement: Element | null): MarkdownHeading[] => {
    if (!contentElement) return [] as MarkdownHeading[];
    const headings = [...contentElement.querySelectorAll<HTMLElement>('h1, h2')];
    return headings.map((heading) => ({
      title: heading.innerText,
      depth: parseInt(heading.nodeName.replace(/\D/g, '')) || 0,
      id: heading.getAttribute('id') || '',
      active: false,
    }));
  };

  const setHeadingActive = (id: string) => {
    if (showMoreButtonVisible) {
      setShowMoreButtonVisible(false);
      expand();
    }
    setHeadings(
      (prev) =>
        prev?.reduce((pV, cV) => {
          if (cV.id === id) cV.active = true;
          else cV.active = false;
          pV.push(cV);
          return pV;
        }, [] as MarkdownHeading[]),
    );
  };

  useEffect(() => {
    const renderedMarkdown = document.querySelector<Element>('#main-text');
    setHeadings(generateLinkMarkup(renderedMarkdown));
  }, [project]);

  return (
    <Card sx={wrapperStyles}>
      <Stack sx={contentStyles}>
        <Box sx={{ height: contentSize, overflow: 'hidden' }}>
          <Box sx={{ ...showMoreButtonStyle, visibility: showMoreButtonVisible ? 'visible' : 'hidden' }}>
            <IconButton aria-label="delete" sx={{ color: 'rgba(0, 0, 0, 1)' }} onClick={expand}>
              <ArrowDownwardIcon />
            </IconButton>
          </Box>
          <Grid container>
            <Grid xs={2}>
              <Box>
                <ProjectTextAnchorMenu headings={headings} setHeadingActive={setHeadingActive} />
              </Box>
            </Grid>

            <Grid xs={7}>
              <ProjectText showMoreButtonVisible={showMoreButtonVisible} text={project.description.text} />
            </Grid>

            <Grid xs={3}>
              <Box sx={infoItemRightContainerStyles}>
                <InfoItemRight description={project.description} />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ width: '662px' }} />
        <ProjectTags tags={project.description.tags} />
        <AuthorInformation projectName={projectName} author={project.description.author} />
        <Divider sx={{ my: 2, width: '662px' }} />
        <CommentsSection />
      </Stack>
    </Card>
  );
};

// Project Progress Styles
const wrapperStyles = {
  borderRadius: '24px',
  background: '#FFF',
  position: 'relative',
  zIndex: 0,
  boxShadow:
    '0px 8px 15px -7px rgba(0, 0, 0, 0.10), 0px 12px 38px 3px rgba(0, 0, 0, 0.03), 0px 9px 46px 8px rgba(0, 0, 0, 0.35)',
  flexGrow: 1,
};

const contentStyles = {
  margin: '88px 64px',
};

const showMoreButtonStyle = {
  background: 'linear-gradient(to bottom, rgba(255,0,0,0), rgba(255,255,255,1))',
  position: 'absolute',
  bottom: '60%',
  paddingTop: '150px',
  textAlign: 'center',
  width: '100%',
  borderRadius: '4px',
  ml: '-32px',
};

const infoItemRightContainerStyles = {
  marginLeft: '5%',
  marginTop: '25%',
};

const infoItemRightStyles = {
  width: 270,
  backgroundColor: '#EBF3F7',
  borderRadius: '8px',
};

const dividerStyle = {
  width: '100%',
  height: '2px',
  bgcolor: 'common.white',
  borderColor: 'common.white',
  mb: '17px',
};

const muiMarkdownOverrides = {
  ...getOverrides(), // This will keep the other default overrides.
  p: {
    component: 'p',
    props: {
      style: { color: 'text.primary' },
    } as React.HTMLProps<HTMLParagraphElement>,
  },
  code: {
    component: 'code',
    props: {
      style: { color: 'text.primary' },
    } as React.HTMLProps<HTMLParagraphElement>,
  },
  h1: {
    component: 'h1',
    props: {
      style: { scrollMargin: '5em' },
    } as React.HTMLProps<HTMLParagraphElement>,
  },
  h2: {
    component: 'h2',
    props: {
      style: { scrollMargin: '5em' },
    } as React.HTMLProps<HTMLParagraphElement>,
  },
};
