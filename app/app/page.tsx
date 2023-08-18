"use client";
import { useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { FeaturedProjectSlider } from "@/components/layout/FeaturedProjectSlider";
import React from "react";
import Container from "@mui/material/Container";
import Layout from "../components/layout/Layout";
import { ProjectSection } from "@/components/layout/projectSection/ProjectSection";

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
          <ProjectSection />
        </Box>
      </Container>
    </Layout>
  );
}

export default IndexPage;
