import Link from 'next/link';

import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import Box from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { useNewsFeed } from '@/app/contexts/news-feed-context';
import { NewsFeedEntry } from '@/common/types';
import { getNewsTypeProjectId } from '@/utils/helpers';

export interface FollowButtonWithLinkProps extends ButtonProps {
  entry: NewsFeedEntry;
  label?: string;
  onIconClick?: () => void;
  isSelected?: boolean;
}

function FollowButtonWithLink(props: FollowButtonWithLinkProps) {
  const { entry, onIconClick, isSelected = false } = props;
  const { projects } = useNewsFeed();
  const projectId = getNewsTypeProjectId(entry);
  const projectName = projects?.find((project) => project.id === entry.item.projectId)?.title;

  if (projectId && !projectName) {
    return <Skeleton variant="rounded" height={25} width={170} />;
  }

  return (
    <>
      <Box sx={containerStyles}>
        {projectId && (
          <Link href={`/projects/${projectId}?tab=2`} style={linkStyles}>
            <Typography variant="subtitle2" sx={labelStyles}>
              {projectName}
            </Typography>
          </Link>
        )}

        <Button onClick={onIconClick} sx={{ ...buttonStyles, backgroundColor: isSelected ? '#D4FCCA' : 'white' }}>
          {isSelected ? (
            <BookmarkAddedOutlinedIcon fontSize="small" style={{ color: '#266446' }} />
          ) : (
            <BookmarkAddOutlinedIcon fontSize="small" style={{ color: '#266446' }} />
          )}
        </Button>
      </Box>
    </>
  );
}

export default FollowButtonWithLink;

// Follow Button With Link Styles
const containerStyles = {
  display: 'flex',
  border: '1px solid #266446',
  borderRadius: '2px',
  background: 'rgba(255, 255, 255, 0.10)',
  padding: 0,
  margin: 0,
};

const linkStyles = {
  textDecoration: 'none',
  cursor: 'pointer',
};

const labelStyles = {
  fontSize: '14px',
  color: 'primary.main',
  padding: '0 16px',
  borderRight: '1px solid #266446',
};

const buttonStyles = {
  paddingX: '6px',
  paddingY: 0,
  margin: 0,
  minWidth: 'unset',
  borderRadius: 0,
  '&:hover': {
    background: '#D4FCCA',
  },
  '&:active': {
    background: '#D4FCCA',
  },
};
