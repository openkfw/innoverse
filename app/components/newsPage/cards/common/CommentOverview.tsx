import Image from 'next/image';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { parseStringForLinks } from '@/components/common/LinkString';

interface CommentOverviewProps {
  title: string;
  description: string;
  projectId?: string;
  image?: string;
}

function CommentOverview(props: CommentOverviewProps) {
  return <CommentOverviewContent {...props} />;
}

const CommentOverviewContent = (props: CommentOverviewProps) => {
  const { title, description, image } = props;

  return (
    <Box sx={wrapperStyles}>
      {image && <Image src={image} alt={image} width={85} height={48} />}

      <Box sx={textWrapperStyles}>
        <Typography variant="h5" sx={titleStyles}>
          {title}
        </Typography>

        <Typography variant="body1" sx={descriptionStyles}>
          {parseStringForLinks(description)}
        </Typography>
      </Box>
    </Box>
  );
};

export default CommentOverview;

// Comment Overview Styles

const wrapperStyles = {
  display: 'flex',
  alignItems: 'center',
  color: 'secondary.contrastText',
  borderRadius: '4px',
  border: '1px solid rgba(0, 0, 0, 0.10)',
  background: '#FBFAF6',
  padding: '12px',
  gap: 2,
  marginBottom: 2,
};

const textWrapperStyles = {
  flex: 1,
  minWidth: 0,
};

const titleStyles = {
  overflow: 'hidden',
  color: 'text.primary',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: '16px',
  fontStyle: 'normal',
  fontWeight: 900,
  lineHeight: '140%',
  letterSpacing: '-0.5px',
  width: '100%',
};

const descriptionStyles = {
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: 'text.primary',
};
