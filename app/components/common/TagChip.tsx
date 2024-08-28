import Chip from '@mui/material/Chip';
import { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

type CustomChipProps = {
  label: string;
  sx?: SxProps;
};

export default function TagChip({ label, sx }: CustomChipProps) {
  return (
    <Chip
      label={
        <Typography variant="caption" color="text.primary">
          {label}
        </Typography>
      }
      variant="filled"
      sx={{
        fontSize: 13,
        fontFamily: 'SansDefaultReg',
        ...sx,
      }}
    />
  );
}
