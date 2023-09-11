import * as React from 'react';
import { useEffect, useState } from 'react';
import Image, { StaticImageData } from 'next/image';

import { CardActionArea } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import bull from '@/components/common/bull';
import ProgressBar, { PROJECT_PROGRESS } from '@/components/common/ProgressBar';

interface ProjectCardProps {
  id: number;
  img: StaticImageData;
  contributors: string[];
  title: string;
  description: string;
}

export default function ProjectCard(props: ProjectCardProps) {
  // -------- (to be removed - replace with real data) - random data to showcase Progress bar steps in project cards
  const [randomStep, setRandomStep] = useState<string>('');
  useEffect(() => {
    const steps = [PROJECT_PROGRESS.EXPLORATION, PROJECT_PROGRESS.KONZEPTION, PROJECT_PROGRESS.PROOF_OF_CONCEPT];

    setRandomStep(steps[Math.floor(Math.random() * steps.length)]);
  }, []);
  // --------

  const { id, img, contributors, title, description } = props;
  return (
    <Card sx={{ width: 466, height: 670, display: 'flex', borderRadius: 4, marginRight: 3 }}>
      <CardActionArea href={`/projects/${encodeURIComponent(id)}`} sx={{ padding: 0, margin: 0 }}>
        <CardMedia sx={{ height: 418 }}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
              src={img}
              height={418}
              width={466}
              style={{ objectFit: 'cover', padding: 18, borderRadius: '24px' }}
              alt="project"
            />
          </div>
        </CardMedia>

        <CardContent sx={{ padding: 3 }}>
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="caption" component="div" display="flex" sx={{ flexWrap: 'wrap' }}>
              {contributors.map((contributor, index) =>
                index < contributors.length - 1 ? (
                  <div key={index}>
                    {contributor}
                    {bull}
                  </div>
                ) : (
                  <div key={index}>{contributor}</div>
                ),
              )}
            </Typography>

            <Typography variant="h5">{title}</Typography>
            <Typography variant="subtitle1" sx={{ color: 'secondary.contrastText', marginBottom: 3 }}>
              {description}
            </Typography>

            <Box sx={{ bottom: 24, position: 'absolute' }}>
              <ProgressBar active={randomStep} />
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
