'use client';

import Link from 'next/link';

import { ProjectUpdateWithAdditionalData } from '@/common/types';
import CustomButton from '@/components/common/CustomButton';
import ErrorPage from '@/components/error/ErrorPage';
import * as m from '@/src/paraglide/messages.js';

import { LandingPageSection } from '../LandingPageSection';

import NewsCarousel from './NewsCarousel';

type NewsProps = {
  updates: ProjectUpdateWithAdditionalData[];
};

export const NewsSection = ({ updates }: NewsProps) => {
  if (!updates) {
    return <ErrorPage />;
  }

  return (
    <LandingPageSection
      id="news"
      title={m.components_landing_newsSection_newsSection_titleNews()}
      subtitle={m.components_landing_newsSection_newsSection_subtitleNews()}
      topRightMenu={
        <Link href="news">
          <CustomButton>{m.components_landing_newsSection_newsSection_moreNews()}</CustomButton>
        </Link>
      }
    >
      {updates.length > 0 && <NewsCarousel updates={updates} />}
    </LandingPageSection>
  );
};
