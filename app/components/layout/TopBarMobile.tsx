'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import { useUser } from '@/app/contexts/user-context';
import { clientConfig } from '@/config/client';
import * as m from '@/src/paraglide/messages.js';

import AvatarWithBadge from '../common/AvatarWithBadge';
import FeedbackSection from '../landing/feedbackSection/FeedbackSection';

import { Headers } from './Layout';

import logo from '/public/images/logo.svg';
import CheckinSection from './dailyCheckinSection/CheckinSection';

interface TopBarProps {
  pages: Headers[];
}

export default function TopBarMobile({ pages }: TopBarProps) {
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
            <AvatarWithBadge />
            <Typography variant="body1"> {user?.name}</Typography>
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
          <Link
            href={clientConfig.NEXT_PUBLIC_STRAPI_ENDPOINT}
            target="_blank"
            style={{ textDecoration: 'none', color: 'common.white' }}
          >
            <ListItem sx={listItemStyles}>Content Editor</ListItem>
          </Link>
          <Link href="/profile" style={{ textDecoration: 'none', color: 'common.white' }} onClick={handleMenuToggle}>
            <ListItem sx={listItemStyles}>{m.components_layout_userMenu_profile()}</ListItem>
          </Link>
          <ListItem sx={listItemStyles} onClick={() => signOut()}>
            {m.components_layout_topBarMobile_signOut()}
          </ListItem>
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
              alt={m.components_layout_topBarMobile_imageAlt()}
              sizes="100vw"
              width={245}
              height={26}
              style={{
                width: '70%',
                height: '70%',
              }}
            />
          </Link>
        </Box>
        <CheckinSection />

        <IconButton
          onClick={handleMenuToggle}
          style={{ color: 'white' }}
          aria-label={
            menuOpen ? m.components_layout_topBarMobile_closeMenu() : m.components_layout_topBarMobile_openMenu()
          }
        >
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
  zIndex: 10000,
  height: '65px',
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
