'use client';

import { type ChangeEventHandler, useEffect, useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { BasicProject } from '@/common/types';
import CustomButton from '@/components/common/CustomButton';
import * as m from '@/src/paraglide/messages.js';
import theme from '@/styles/theme';
import { searchProjects } from '@/utils/requests/project/requests';

import { LandingPageSection } from '../LandingPageSection';

import ProjectCarousel from './ProjectCarousel';
import { ResponsiveSearchInput } from './ResponsiveSearchInput';

import bgBubble from '/public/images/bg-image.png';

export const defaultImage = '/images/ai_01.png';

export type ProjectProps = {
  projects: BasicProject[];
};

export const ProjectSection = ({ projects }: ProjectProps) => {
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState<BasicProject[]>();
  const [isLoading, startTransition] = useTransition();

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!inputValue) {
        setSearchResults([]);
        return;
      }
      startTransition(async () => {
        const response = await searchProjects({ searchString: inputValue, pagination: { page: 0, pageSize: 10 } });
        setSearchResults(response ?? []);
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  return (
    <LandingPageSection
      id="initiativen"
      title={
        <div style={{ display: 'inline-block', width: 'auto' }}>
          <div>{m.components_landing_projectSection_projectSection_title()}</div>
          <ResponsiveSearchInput
            sx={{
              MozBoxSizing: 'border-box',
              WebkitBoxSizing: 'border-box',
              boxSizing: 'border-box',
              width: '100%',
              justifyContent: 'start',
              marginTop: '1rem',
              [theme.breakpoints.down('sm')]: { marginTop: '0.5rem' },
            }}
            onChange={handleInputChange}
          />
        </div>
      }
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
      <ProjectCarousel projects={inputValue.length && searchResults ? searchResults : projects} isLoading={isLoading} />
    </LandingPageSection>
  );
};
