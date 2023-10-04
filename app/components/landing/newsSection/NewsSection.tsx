import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import CustomButton from '@/components/common/CustomButton';
import { NewsSlider } from '@/repository/mock/landing/news-section';

import NewsCarousel from './NewsCarousel';

type NewsSectionProps = {
  news: NewsSlider[];
};

export const NewsSection = (props: NewsSectionProps) => {
  return (
    <Grid container spacing={5} sx={{ m: 5 }}>
      <Grid item container xs={12} sx={{ marginBottom: 1 }}>
        <Grid item xs={9}>
          <Typography variant="overline">Aktuelles aus den Projekten</Typography>
          <Typography variant="h2">Innovationsnews</Typography>
        </Grid>
        <Grid item xs={3} sx={{ mt: 6 }}>
          <CustomButton>Mehr</CustomButton>
        </Grid>
      </Grid>
      <NewsCarousel news={props.news} />
    </Grid>
  );
};
