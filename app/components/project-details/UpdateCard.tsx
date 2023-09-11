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
        <Grid item>
          <Typography variant="caption" sx={{ color: 'text.primary' }}>
            {update.author.name}
          </Typography>
        </Grid>
      </Grid>
      <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.87)' }}>
        {update.content}
      </Typography>
      <Typography variant="caption" color="text.primary">
        {update.date}
      </Typography>
    </>
  );
};

export default UpdateCard;
