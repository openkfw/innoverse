import { useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';

import { User } from '@/common/types';
import { getInnoUserByUsername } from '@/utils/requests/innoUsers/requests';

import { StyledTooltip } from './StyledTooltip';
import { UserTooltip } from './UserTooltip';

interface ClickTooltipProps {
  username: string;
  children: React.ReactNode;
}

export const ClickTooltip: React.FC<ClickTooltipProps> = ({ username, children }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  async function handleFetchUser() {
    setLoading(true);
    try {
      const data = await getInnoUserByUsername(username);
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleClick() {
    setOpen(!open);
    if (!userData) {
      handleFetchUser();
    }
  }

  return (
    <StyledTooltip
      open={open}
      onClose={() => setOpen(false)}
      title={loading ? <CircularProgress size={24} /> : userData ? <UserTooltip user={userData} /> : null}
    >
      <span onClick={handleClick} style={{ cursor: 'pointer' }}>
        {children}
      </span>
    </StyledTooltip>
  );
};
