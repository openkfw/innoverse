'use client';

import { ReactNode } from 'react';
import Image from 'next/image';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import ExplorationIcon from '@/components/icons/ExplorationIcon';
import KonzeptionIcon from '@/components/icons/KonzeptionIcon';
import ProofOfConceptIcon from '@/components/icons/ProofOfConceptIcon';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';

import { ProjectProps } from '../projectSection/ProjectSection';

import PhaseColumns from './PhaseColumns';

import bgBubble from '/public/images/bg-image.png';

export interface MappingDataProps {
  title: string;
  description: string;
  icon: ReactNode;
  isFirstStep?: boolean;
}

const mappingData: MappingDataProps[] = [
  {
    isFirstStep: true,
    title: m.components_landing_mappingProjectsSection_mappingProjectsCard_exploration(),
    icon: <ExplorationIcon />,
    description: m.components_landing_mappingProjectsSection_mappingProjectsCard_explorationDesc(),
  },
  {
    title: m.components_landing_mappingProjectsSection_mappingProjectsCard_conception(),
    icon: <KonzeptionIcon />,
    description: m.components_landing_mappingProjectsSection_mappingProjectsCard_conceptionDesc(),
  },
  {
    title: m.components_landing_mappingProjectsSection_mappingProjectsCard_poc(),
    icon: <ProofOfConceptIcon />,
    description: m.components_landing_mappingProjectsSection_mappingProjectsCard_pocDesc(),
  },
];

export const MappingProjectsCard = (props: ProjectProps) => {
  const { projects } = props;
  return (
    <Box sx={mappingProjectsCardContainerStyles}>
      {/* Left bubble in the background */}
      <BubbleImage />
      <Box
        sx={{
          width: '90%',
          mx: 'auto',
          px: { xs: '0', sm: '64px' },
        }}
      >
        <Card sx={mappingProjectsCardStyles}>
          <CardHeader
            sx={{ textAlign: 'left', mb: '35px' }}
            style={{ padding: 0 }}
            title={
              <Typography variant="h4">
                {m.components_landing_mappingProjectsSection_mappingProjectsCard_stratInno()}
              </Typography>
            }
          />
          <CardContent style={{ padding: 0 }}>
            <PhaseColumns projects={projects} mappingData={mappingData} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

const BubbleImage = () => (
  <Image
    src={bgBubble}
    alt={m.components_landing_mappingProjectsSection_mappingProjectsCard_imageAlt()}
    sizes="33vw"
    style={{
      position: 'absolute',
      width: 570,
      height: 460,
      zIndex: 0,
      opacity: 0.9,
      left: 0,
      overflowX: 'hidden',
      mixBlendMode: 'lighten',
      transform: 'translate(-50%, 20%)',
    }}
  />
);

const mappingProjectsCardContainerStyles = {
  position: 'relative',
  overflowX: 'hidden',
  minHeight: '400px',
  marginTop: '100px',
  [theme.breakpoints.down('sm')]: {
    marginTop: '80px',
  },
};

const mappingProjectsCardStyles = {
  backgroundColor: 'rgba(255,255,255,0.1)',
  backdropFilter: `blur(20px)`,
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.20)',
  height: 'auto',
  boxShadow: '0px 12px 40px 0px rgba(0, 0, 0, 0.25)',
  px: '40px',
  py: '48px',
};
