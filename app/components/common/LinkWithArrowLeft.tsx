import Link from 'next/link';

import ArrowForwardIcon from '@mui/icons-material/ArrowForwardOutlined';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface LinkWithArrowLeftProps {
  title: string;
  href: string;
}

export const LinkWithArrowLeft = ({ title, href, ...props }: LinkWithArrowLeftProps) => {
  return (
    <Link href={href} style={{ textDecoration: 'none' }} {...props}>
      <Stack direction="row" alignItems="center" sx={{ gap: '4px' }}>
        <ArrowForwardIcon sx={{ fontSize: '14px', color: 'primary.main' }} />
        <Typography variant="subtitle2" sx={{ fontSize: '14px', color: 'primary.main' }} noWrap>
          {title}
        </Typography>
      </Stack>
    </Link>
  );
};
