import Link from 'next/link';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

type CustomChipProps = {
  label: string;
  count: number;
  projectId: string;
};

export default function CustomChip(props: CustomChipProps) {
  const { count, label, projectId } = props;

  const getTabIndex = (label: string) => {
    switch (label) {
      case 'Zusammenarbeit':
        return 1;
      case 'News':
        return 2;
      case 'Events':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <Chip
      label={
        <Link href={`/projects/${projectId}?tab=${getTabIndex(label)}`} style={{ textDecoration: 'none' }}>
          <Box sx={containerStyles}>
            <Typography sx={countStyles}>{count}</Typography>
            <Typography sx={labelStyles}>{label}</Typography>
          </Box>
        </Link>
      }
      variant="filled"
      sx={chipStyles}
    />
  );
}

// Custom Chip Styles
const chipStyles = {
  backgroundColor: 'inherit',
  color: 'common.white',
  margin: 0,
  height: '100%',
  padding: 0,
  borderRadius: '100px',
  border: '1px solid rgba(255, 255, 255, 0.50)',
  '& .MuiChip-label': {
    padding: '3px 5px 3px 5px',
    margin: 0,
  },

  '&:hover': {
    border: '1px solid #B7F9AA',
    backgroundColor: 'action.hover',
    '& .MuiTypography-root': {
      color: 'primary.main',
    },
  },
};

const containerStyles = {
  marginBottom: '-1px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '3px',
};

const labelStyles = {
  fontSize: '13px',
  fontFamily: 'SansDefaultReg',
};

const countStyles = {
  backgroundColor: 'white',
  color: '#41484C',
  borderRadius: '100px',
  padding: '0 5px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontStyle: 'normal',
  fontWeight: '700',
  height: '16px',
  fontSize: '12px',
  lineHeight: '16px',
  letterSpacing: '0.4px',
  fontFamily: 'SansDefaultMed',
};
