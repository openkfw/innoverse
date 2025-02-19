import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { mergeStyles } from '@/utils/helpers';

interface LikeControlProps {
  onLike: () => void;
  isSelected: boolean;
  likeNumber: number;
}

export const LikeControl = ({ onLike, isSelected, likeNumber }: LikeControlProps) => {
  const LikeCount = () => (
    <>
      <Typography variant="caption" sx={isSelected ? textStyleSelected : textStyle}>
        {likeNumber}
      </Typography>
    </>
  );

  return (
    <Button
      onClick={() => onLike()}
      sx={mergeStyles(iconButtonOnlyStyles, isSelected ? buttonStylesSelected : buttonStyles)}
    >
      {isSelected ? <FavoriteIcon sx={iconStyles} /> : <FavoriteBorderOutlinedIcon sx={iconStyles} />}

      {likeNumber > 0 && <LikeCount />}
    </Button>
  );
};

const iconButtonOnlyStyles = {
  width: '32px',
  height: '32px',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '2px',
  gap: '3px',
  minWidth: '40px',
  mr: 1,
};

const buttonStyles = {
  border: '1px solid #D8DFE3;',
  backgroundColor: 'transparent',
};

const buttonStylesSelected = {
  border: '1px solid #266446',
  background: '#D4FCCA',
};

const iconStyles = {
  color: '#266446',
  fontSize: '18px',
};
const textStyle = {
  color: 'secondary.contrastText',
};
const textStyleSelected = {
  color: '#266446',
};
