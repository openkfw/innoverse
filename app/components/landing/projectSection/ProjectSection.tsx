'use client';

import Image from 'next/image';
import Link from 'next/link';

import { BasicProject } from '@/common/types';
import CustomButton from '@/components/common/CustomButton';
import * as m from '@/src/paraglide/messages.js';

import { LandingPageSection } from '../LandingPageSection';

import ProjectCarousel from './ProjectCarousel';

import bgBubble from '/public/images/bg-image.png';

export const defaultImage = '/images/ai_01.png';

export type ProjectProps = {
  projects: BasicProject[];
};

export const ProjectSection = ({ projects }: ProjectProps) => {
  return (
    <LandingPageSection
      id="initiativen"
      title={m.components_landing_projectSection_projectSection_title()}
      subtitle={m.components_landing_projectSection_projectSection_subtitle()}
      topRightMenu={
        <Link href="projects">
          <CustomButton>{m.components_landing_projectSection_projectSection_moreInitiatives()}</CustomButton>
        </Link>
      }
      beforeContent={
        <div
          style={{
            position: 'absolute',
            right: '0',
            zIndex: 0,
            transform: 'translate(50%, -10%)',

            height: '0',
            paddingBottom: 'calc(33vw * 535 / 677)',
            opacity: 0.56,
            mixBlendMode: 'lighten',
          }}
        >
          <Image
            src={bgBubble}
            alt={m.components_landing_projectSection_projectSection_imageAlt()}
            fill
            style={{ objectFit: 'cover' }}
            sizes="33vw"
          />
        </div>
      }
    >
      <ProjectCarousel projects={projects} />
    </LandingPageSection>
  );
};
