"use client";

import Box from "@mui/material/Box";

import { FeaturedProjectSlider } from "@/components/landing/FeaturedProjectSlider";
import Container from "@mui/material/Container";
import Layout from "../components/layout/Layout";





function IndexPage() {
  return (
    <Layout>
      <Container maxWidth="lg">
        <Box
          sx={{
            py: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FeaturedProjectSlider />
        </Box>
      </Container>
    </Layout>
  );
}

export default IndexPage;
