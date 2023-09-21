import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

interface UserMenuProps {
  anchorElUser: HTMLElement | null;
  setAnchorElUser: (anchor: HTMLElement | null) => void;
}

export default function UserMenu(props: UserMenuProps) {
  const { anchorElUser, setAnchorElUser } = props;

  const open = Boolean(anchorElUser);

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Menu
      anchorEl={anchorElUser}
      open={open}
      onClose={handleCloseUserMenu}
      onClick={handleCloseUserMenu}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      PaperProps={{ style: { width: 220, marginTop: 16 } }}
    >
      <MenuItem>
        <Typography variant="body2" color="text.primary">
          Profil
        </Typography>
      </MenuItem>
      <MenuItem>
        <Typography variant="body2" color="text.primary">
          Notification
        </Typography>
        <Badge
          badgeContent={4}
          color="secondary"
          sx={{
            ml: 2,
            '& .MuiBadge-colorSecondary': {
              color: 'common.white',
            },
          }}
        />
      </MenuItem>
    </Menu>
  );
}
