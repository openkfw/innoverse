import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";

import { useTheme } from "@mui/material/styles";

import Link from "next/link";
import Image from "next/image";

import logo from "../../assets/logo.png";

export default function TopBar() {
  const theme = useTheme();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ backgroundColor: theme.palette.background.default }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box sx={{ width: 200, height: 50, display: "block" }}>
              <Link href="/">
                <Image
                  src={logo}
                  alt="***STRING_REMOVED***  Logo"
                  sizes="100vw"
                  style={{
                    width: "100%",
                    height: "auto"
                  }} />
              </Link>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
