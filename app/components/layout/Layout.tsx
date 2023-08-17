import Container from "@mui/material/Container";

import theme from "@/styles/theme";
import TopBar from "./TopBar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <TopBar />

      {/* About page is overriding this in the PageGridSection.tsx to have full width colored background */}
      <Container
        maxWidth="xl"
        style={{
          background: `linear-gradient(84deg, ${theme.palette.primary?.dark} 0%, ${theme.palette.primary?.light} 100%)`,
        }}
      >
        {children}
      </Container>
      {/* <Footer /> */}
    </div>
  );
}
