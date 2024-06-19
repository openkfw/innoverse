'use client';

import Link from 'next/link';

import { ProjectUpdateWithAdditionalData } from '@/common/types';
import CustomButton from '@/components/common/CustomButton';
import ErrorPage from '@/components/error/ErrorPage';

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
      title="Innovationsnews"
      subtitle="Aktuelles aus den Initiativen"
      topRightMenu={
        <Link href="news">
          <CustomButton>Mehr news</CustomButton>
        </Link>
      }
    >
      {updates.length > 0 && <NewsCarousel updates={updates} />}
    </LandingPageSection>
  );
};
