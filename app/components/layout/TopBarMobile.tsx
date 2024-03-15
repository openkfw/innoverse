import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Box, Drawer, IconButton, List, ListItem, Typography } from '@mui/material';

import { useUser } from '@/app/contexts/user-context';

import FeedbackSection from '../landing/feedbackSection/FeedbackSection';

import logo from '/public/images/logo.svg';

type Headers = {
  text: string;
  link?: string;
};

const pages: Headers[] = [
  { text: 'Initiativen', link: '/#initiativen' },
  { text: 'News', link: '/news' },
  { text: 'AI Assistant' },
];

export default function TopBarMobile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useUser();

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const renderMobileMenu = () => (
    <Drawer
      anchor="top"
      open={menuOpen}
      onClose={handleMenuToggle}
      sx={{
        '& .MuiDrawer-paper': {
          height: '100%',
          background: 'linear-gradient(to bottom right, #004267 34.33%, #005A8C 79.38%)',
          flexShrink: 0,
        },
      }}
    >
      <nav>
      <List sx={listStyles}>
        <ListItem sx={{ ...listItemStyles, marginBottom: 2 }}>
          <Avatar /> <Typography variant="body1"> {user?.name}</Typography>
        </ListItem>
        {pages.map((page) =>
          page.link ? (
            <Link
              key={page.text}
              href={page.link}
              style={{ textDecoration: 'none', color: 'common.white' }}
              onClick={handleMenuToggle}
            >
              <ListItem sx={listItemStyles}>{page.text}</ListItem>
            </Link>
          ) : (
            <ListItem key={page.text} sx={listItemDisabledStyles}>
              {page.text}
            </ListItem>
          ),
        )}
      </List>
      </nav>

      <div>
        <FeedbackSection />
      </div>
    </Drawer>
  );

  return (
    <Box>
      <Box sx={wrapperStyles}>
        <Box sx={{ width: 245, display: 'block' }}>
          <Link href="/">
            <Image
              src={logo}
              alt="***STRING_REMOVED***  Logo"
              sizes="100vw"
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </Link>
        </Box>

        <IconButton onClick={handleMenuToggle} style={{ color: 'white' }}  aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      {renderMobileMenu()}
    </Box>
  );
}

// Top Bar Mobile Styles
const wrapperStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 2,
  margin: 0,
  background: 'rgba(0, 0, 0, 0.15)',
  backdropFilter: 'blur(20px)',
  position: 'fixed',
  width: '100%',
  zIndex: 1201,
};

const listStyles = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  marginTop: '92px',
  marginLeft: '15px',
};

const listItemStyles = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: 1,
  padding: '12px 16px',
  marginBottom: 1,
  color: 'common.white',
};

const listItemDisabledStyles = {
  ...listItemStyles,
  color: 'rgba(155, 155, 155, 1)',
  pointerEvents: 'none',
};
