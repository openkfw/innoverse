import Link from 'next/link';

import ArrowForwardIcon from '@mui/icons-material/ArrowForwardOutlined';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface LinkWithArrowLeftProps {
  title: string;
  href: string;
}

export const LinkWithArrowLeft = ({ title, href }: LinkWithArrowLeftProps) => {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <Stack direction="row" alignItems="center">
        <ArrowForwardIcon sx={{ fontSize: '14px', color: 'primary.main' }} />
        <Typography variant="subtitle2" sx={{ fontSize: '14px', color: 'primary.main' }} noWrap>
          {title}
        </Typography>
      </Stack>
    </Link>
  );
};
