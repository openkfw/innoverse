import ReplyIcon from '@/components/icons/ReplyIcon';

import { CustomIconButton } from '../../CustomIconButton';

interface ResponseControlProps {
  onResponse: () => void;
}

export const ResponseControls = ({ onResponse }: ResponseControlProps) => {
  return (
    <CustomIconButton startIcon={<ReplyIcon />} onClick={onResponse}>
      antworten
    </CustomIconButton>
  );
};
