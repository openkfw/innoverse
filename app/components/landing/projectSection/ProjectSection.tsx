'use client';

import Image from 'next/image';

import { Project } from '@/common/types';

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
        <div style={{
          position: 'absolute',
          right: '0',
          zIndex: 0,
          transform: 'translate(50%, -10%)',
          width: '33vw', 
          height: '0',
          paddingBottom: 'calc(33vw * 535 / 677)',
          opacity: 0.56,
          mixBlendMode: 'lighten',
        }}>
          <Image
            src={bgBubble}
            alt="background bubble"
            layout="fill"
            objectFit="cover"
          />
        </div>
      }
    >
      <ProjectCarousel projects={projects} />
    </LandingPageSection>
  );
};
