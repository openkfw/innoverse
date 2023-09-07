import Chip from '@mui/material/Chip';

type CustomChipProps = {
  label: string;
};

export default function CustomChip(props: CustomChipProps) {
  return (
    <Chip
      label={props.label}
      variant="filled"
      sx={{
        backgroundColor: 'rgba(255,255,255,0.1)',
        color: 'common.white',
        fontSize: 13,
        fontFamily: '***FONT_REMOVED***',
      }}
    />
  );
}
