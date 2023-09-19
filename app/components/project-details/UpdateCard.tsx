import { StaticImageData } from 'next/image';

import { Grid, Typography } from '@mui/material';

import AvatarIcon from '../common/AvatarIcon';

interface UpdateCardProps {
  update: {
    author: {
      name: string;
      avatar: StaticImageData;
    };
    content: string;
    date: string;
  };
}

const UpdateCard = (props: UpdateCardProps) => {
  const { update } = props;

  return (
    <>
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          <AvatarIcon key={update.author.name} src={update.author.avatar} size={20} />
        </Grid>
        <Grid item sx={{ marginLeft: 1, paddingLeft: '0 !important' }}>
          <Typography variant="caption" sx={{ color: 'text.primary', fontSize: 16 }}>
            {update.author.name}
          </Typography>
        </Grid>
      </Grid>
      <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.87)', marginTop: 1, marginBottom: 1 }}>
        {update.content}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {update.date}
      </Typography>
    </>
  );
};

export default UpdateCard;
