import ReplyIcon from '@/components/icons/ReplyIcon';
import * as m from '@/src/paraglide/messages.js';

import { CustomIconButton } from '../../CustomIconButton';

interface ResponseControlProps {
  onResponse: () => void;
}

export const ResponseControls = ({ onResponse }: ResponseControlProps) => {
  return (
    <CustomIconButton startIcon={<ReplyIcon />} onClick={onResponse}>
      {m.components_common_editing_controls_responseControl_answer()}
    </CustomIconButton>
  );
};
