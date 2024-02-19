'use client';

import Image from 'next/image';

import { Project } from '@/common/types';
import CustomButton from '@/components/common/CustomButton';

import { LandingPageSection } from '../LandingPageSection';

import ProjectCarousel from './ProjectCarousel';

import bgBubble from '/public/images/bg-image.png';

export const defaultImage = '/images/ai_01.png';

export type ProjectProps = {
  projects: Project[];
};

export const ProjectSection = ({ projects }: ProjectProps) => {
  return (
    <LandingPageSection
      id="initiativen"
      title="Innovationsinitativen"
      subtitle="Aktuelle Pipeline"
      beforeContent={
        <Image
          src={bgBubble}
          alt="background-bubble"
          sizes="33vw"
          style={{
            position: 'absolute',
            width: 570,
            height: 460,
            zIndex: 0,
            opacity: 0.56,
            right: 0,
            mixBlendMode: 'lighten',
            transform: 'translate(50%, -10%)',
          }}
        />
      }
      topRightMenu={<CustomButton>Mehr</CustomButton>}
    >
      <ProjectCarousel projects={projects} />
    </LandingPageSection>
  );
};
