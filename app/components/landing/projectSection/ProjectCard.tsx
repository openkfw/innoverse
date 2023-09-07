import Image, { StaticImageData } from 'next/image';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

interface ProjectCardProps {
  id: number;
  img: StaticImageData;
  contributors: string[];
  title: string;
  description: string;
}

const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '6px', transform: 'scale(0.8)' }}>
    •
  </Box>
);

export default function ProjectCard(props: ProjectCardProps) {
  const { id, img, contributors, title, description } = props;

  return (
    <Link href={`/projects/${encodeURIComponent(id)}`} underline="none">
      <Card sx={{ height: 550, borderRadius: '24px' }}>
        <CardMedia sx={{ height: 350 }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
            <Image
              src={img}
              width={200}
              height={360}
              style={{ objectFit: 'cover', padding: 18, borderRadius: '24px' }}
              alt="project"
            />
          </div>
        </CardMedia>

        <CardContent sx={{ p: 3, textAlign: 'left' }}>
          <Typography variant="caption" component="div" display="flex">
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
          <Typography variant="subtitle1" sx={{ color: 'secondary.contrastText' }}>
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
