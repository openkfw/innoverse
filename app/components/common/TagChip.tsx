import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

type CustomChipProps = {
  label: string;
};

export default function TagChip(props: CustomChipProps) {
  return (
    <Chip
      label={
        <Typography variant="caption" color="text.primary">
          {props.label}
        </Typography>
      }
      variant="filled"
      sx={{
        fontSize: 13,
        fontFamily: '***FONT_REMOVED***',
      }}
    />
  );
}
