import { Avatar, Grid, Typography } from '@mui/material';

interface UpdateCardProps {
  update: {
    author: {
      name: string;
      avatar: string;
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
          <Avatar key={update.author.name} alt={update.author.name} src={update.author.avatar} />
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
      <Typography variant="caption" sx={{ color: '#507666' }}>
        {update.date}
      </Typography>
    </>
  );
};

export default UpdateCard;
