'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

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

import { Project } from '@/common/types';
import theme from '@/styles/theme';

import { useExpandableContainer } from '../common/expandableContainer/ExpandableContainer';
import { parseStringForLinks } from '../common/LinkString';
import MuiMarkdownSection from '../common/MuiMarkdownSection';

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

interface ProjectHeadingProps {
  heading: MarkdownHeading;
  setHeadingActive: (id: string) => void;
}

export const ProjectProgress = (props: ProjectProgressProps) => {
  const { project, projectName } = props;

  return (
    <Card sx={wrapperStyle}>
      <Stack sx={contentStyle}>
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
    return headings.map((heading, key) => ({
      title: heading.innerText,
      depth: parseInt(heading.nodeName.replace(/\D/g, '')) || 0,
      id: heading.getAttribute('id') || '',
      active: key === 0 ? true : false,
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
    <Grid container direction="row" spacing={1}>
      {headings.length > 0 && (
        <Grid item md={4} lg={3}>
          <ProjectTextAnchorMenu headings={headings} setHeadingActive={setHeadingActive} />
        </Grid>
      )}
      <Grid item sm={12} md={headings.length > 0 ? 8 : 12} lg={headings.length > 0 ? 6 : 9}>
        {container.element}
      </Grid>
      <Grid item md={0} lg={3}>
        <Box sx={containerStyle}>
          <InfoItemRight title={project.title} summary={project.summary} />
        </Box>
      </Grid>
    </Grid>
  );
};

const InfoItemRight = ({ title, summary }: InfoItemProps) => {
  return (
    <Card sx={infoItemRightStyle} elevation={0}>
      <CardContent sx={{ p: '18px', pb: 1 }}>
        <Typography variant="subtitle1" color="#5A6166" sx={{ ...textOverflowStyle, textTransform: 'uppercase' }}>
          {title}
        </Typography>
      </CardContent>
      <Divider sx={infoItemDividerStyle} />

      <CardMedia sx={{ px: '18px' }}>
        <Image src={robotic_hand} alt="image" width={0} height={0} style={{ width: '100%', height: 'auto' }} />
      </CardMedia>
      <CardContent sx={{ p: '18px' }}>
        <Typography variant="subtitle2" color="#5A6166" sx={textOverflowStyle}>
          {parseStringForLinks(summary)}
        </Typography>
      </CardContent>
    </Card>
  );
};

const ProjectText = ({ text, sx }: ProjectTextProps) => (
  <Box id="main-text" sx={sx}>
    <MuiMarkdownSection text={text} />
  </Box>
);

const ProjectHeading = ({ heading, setHeadingActive }: ProjectHeadingProps) => {
  const dividerStyle = {
    borderWidth: heading.active ? '2px' : '1px',
    m: 0,
    borderColor: heading.active ? '#99A815' : '#32373B',
    opacity: heading.active ? 1 : 0.2,
  };

  return (
    <Stack direction="row">
      <Divider orientation="vertical" variant="middle" flexItem sx={dividerStyle} />
      <ListItemButton sx={listItemStyle} key={heading.id} onClick={() => setHeadingActive(heading.id)}>
        <Link sx={{ ...linkStyle, ...textOverflowStyle }} href={`#${heading.id}`} variant="subtitle1">
          {heading.title}
        </Link>
      </ListItemButton>
    </Stack>
  );
};

const ProjectTextAnchorMenu = ({ headings, setHeadingActive }: ProjectTextAnchorMenuProps) => {
  return (
    <Box sx={menuStyles}>
      <List sx={listStyle} component="nav" aria-labelledby="nested-list-subheader">
        {headings?.map((heading) => {
          if (heading.depth > 1) {
            return (
              <Collapse in timeout="auto" unmountOnExit key={heading.id}>
                <List disablePadding>
                  <ProjectHeading heading={heading} setHeadingActive={setHeadingActive} />
                </List>
              </Collapse>
            );
          }
          return <ProjectHeading heading={heading} setHeadingActive={setHeadingActive} key={heading.id} />;
        })}
      </List>
    </Box>
  );
};

// Project Progress Styles
const menuStyles = {
  borderRadius: '16px',
  p: '24px',
  border: '1px solid rgba(0, 90, 140, 0.20)',
  width: '90%',
};

const textOverflowStyle = {
  hyphens: 'auto',
  WebkitHyphens: 'auto',
  MsHyphens: 'auto',
  MozHyphens: 'auto',
  WebkitLocale: 'de-DE',
  locale: 'de-DE',
};

const listItemStyle = {
  pl: '20px',
  mb: '10px',
  pt: 0,
  '&:last-child': {
    pb: 0,
  },
  '&:hover': {
    borderRadius: '8px',
    backgroundColor: 'rgba(0, 90, 140, 0.1)',
  },
};

const linkStyle = {
  color: '#99A815',
  lineHeight: '140%',
  textDecoration: 'none',
  '&:hover': { color: '#99A815' },
};

const containerStyle = {
  marginLeft: '5%',
  marginTop: '25%',
  [theme.breakpoints.down('lg')]: {
    display: 'none',
  },
};

const contentStyle = {
  margin: '88px 64px',
  [theme.breakpoints.down('md')]: {
    margin: '48px 24px',
  },
};

const wrapperStyle = {
  borderRadius: '24px',
  background: '#FFF',
  position: 'relative',
  zIndex: 0,
  boxShadow:
    '0px 8px 15px -7px rgba(0, 0, 0, 0.10), 0px 12px 38px 3px rgba(0, 0, 0, 0.03), 0px 9px 46px 8px rgba(0, 0, 0, 0.35)',
  flexGrow: 1,
};

const listStyle: SxProps = {
  wordBreak: 'break-word',
};

const infoItemRightStyle = {
  width: '270px',
  maxWidth: '100%',
  backgroundColor: '#EBF3F7',
  borderRadius: '8px',
  marginBottom: 1,
};

const infoItemDividerStyle = {
  width: '100%',
  height: '2px',
  bgcolor: 'common.white',
  borderColor: 'common.white',
  mb: '17px',
};
