'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import MuiMarkdown, { getOverrides, Overrides } from 'mui-markdown';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import triggerAnalyticsEvent from '@/analytics/analytics';
import { Project } from '@/common/types';
import theme from '@/styles/theme';

import { useExpandableContainer } from '../common/expandableContainer/ExpandableContainer';
import { parseStringForLinks } from '../common/LinkString';

import CommentsSection from './comments/CommentsSection';
import { AuthorInformation } from './AuthorInformation';
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
  title: string;
  summary: string;
}

interface ProjectTextProps {
  text: string;
  sx?: SxProps;
}

interface ProjectTextAnchorMenuProps {
  headings: MarkdownHeading[] | undefined;
  setHeadingActive: (id: string) => void;
}

export const ProjectProgress = (props: ProjectProgressProps) => {
  const { project, projectName } = props;

  return (
    <Card sx={wrapperStyles}>
      <Stack sx={contentStyles}>
        <ProjectDescription project={project} />
        <Divider sx={{ width: { xs: '100%', lg: '70%' } }} />
        <ProjectTags tags={project.description.tags} />
        {project.author && <AuthorInformation projectName={projectName} author={project.author} />}
        <Divider sx={{ my: 2, width: '100%' }} />
        <CommentsSection project={project} />
      </Stack>
    </Card>
  );
};

const ProjectDescription = ({ project }: { project: Project }) => {
  const [headings, setHeadings] = useState<MarkdownHeading[]>([]);

  const container = useExpandableContainer({
    collapsedHeight: 600,
    maxExpandedHeight: 800,
    content: <ProjectText text={project.description.text} sx={{ pr: 2 }} />,
    onExpand: () => triggerAnalyticsEvent('expand-project-description', project.projectName),
  });

  const setHeadingActive = (id: string) => {
    if (container.isOverflowing) {
      container.expand();
    }

    setHeadings((prev) =>
      prev?.reduce((pV, cV) => {
        if (cV.id === id) cV.active = true;
        else cV.active = false;
        pV.push(cV);
        return pV;
      }, [] as MarkdownHeading[]),
    );
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

  useEffect(
    function filterAndSetHeadings() {
      const renderedMarkdown = document.querySelector<Element>('#main-text');
      const headingsMarkup = generateLinkMarkup(renderedMarkdown);
      setHeadings(headingsMarkup);
    },
    [project],
  );

  return (
    <Grid container direction={'row'}>
      <Grid item lg={2} md={3} sx={textAnchorMenuStyles} hidden={!headings.length}>
        <ProjectTextAnchorMenu headings={headings} setHeadingActive={setHeadingActive} />
      </Grid>

      <Grid item xs flexGrow={1}>
        {container.element}
      </Grid>

      <Grid item md={0} lg={3}>
        <Box sx={infoItemRightContainerStyles}>
          <InfoItemRight title={project.title} summary={project.summary} />
        </Box>
      </Grid>
    </Grid>
  );
};

const InfoItemRight = ({ title, summary }: InfoItemProps) => {
  return (
    <Card sx={infoItemRightStyles} elevation={0}>
      <CardContent sx={{ p: '18px', pb: 1 }}>
        <Typography variant="subtitle1" color="text.primary" sx={{ textTransform: 'uppercase' }}>
          {title}
        </Typography>
      </CardContent>
      <Divider sx={dividerStyle} />

      <CardMedia sx={{ display: 'flex', justifyContent: 'center' }}>
        <Image src={robotic_hand} alt="image" width={235} height={132} />
      </CardMedia>
      <CardContent sx={{ p: '18px' }}>
        <Typography variant="subtitle2" color="text.primary">
          {parseStringForLinks(summary)}
        </Typography>
      </CardContent>
    </Card>
  );
};

const ProjectText = ({ text, sx }: ProjectTextProps) => (
  <Box id="main-text" sx={sx}>
    <MuiMarkdown overrides={muiMarkdownOverrides as Overrides}>{text}</MuiMarkdown>
  </Box>
);

const ProjectTextAnchorMenu = (props: ProjectTextAnchorMenuProps) => {
  const listStyles: SxProps = {
    width: '100%',
    maxWidth: 360,
    bgcolor: 'background.paper',
    wordBreak: 'break-word',
  };

  return (
    <Box>
      <List sx={listStyles} component="nav" aria-labelledby="nested-list-subheader">
        {props.headings?.map((heading) => {
          if (heading.depth > 1) {
            return (
              <Collapse in timeout="auto" unmountOnExit key={heading.id}>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 1, mr: 3 }} onClick={() => props.setHeadingActive(heading.id)}>
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
            <ListItemButton sx={{ mr: 3, pl: 0 }} key={heading.id} onClick={() => props.setHeadingActive(heading.id)}>
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

const textAnchorMenuStyles: SxProps = {
  verflowWrap: 'anywhere',
  hyphens: 'auto',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
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
  [theme.breakpoints.down('md')]: {
    margin: '48px 24px',
  },
};

const infoItemRightContainerStyles = {
  marginLeft: '5%',
  marginTop: '25%',
  [theme.breakpoints.down('lg')]: {
    display: 'none',
  },
};

const infoItemRightStyles = {
  width: '270px',
  maxWidth: '100%',
  backgroundColor: '#EBF3F7',
  borderRadius: '8px',
  marginBottom: 1,
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
      style: { scrollMargin: '5em', color: 'text.primary', lineHeight: 1 },
    } as React.HTMLProps<HTMLParagraphElement>,
  },
  h2: {
    component: 'h2',
    props: {
      style: { scrollMargin: '5em', color: 'text.primary' },
    } as React.HTMLProps<HTMLParagraphElement>,
  },
  h3: {
    component: 'h3',
    props: {
      style: { scrollMargin: '5em', color: 'text.primary' },
    } as React.HTMLProps<HTMLParagraphElement>,
  },
  img: {
    component: 'img',
    props: {
      style: {
        maxWidth: '100%',
        height: 'auto',
        padding: '1em',
        objectFit: 'contain',
      },
    } as React.HTMLProps<HTMLImageElement>,
  },
  //If there is nothing but text in the description, it will be a span component.
  span: {
    component: 'p',
    props: {
      style: { color: 'text.primary' },
    } as React.HTMLProps<HTMLParagraphElement>,
  },
};
