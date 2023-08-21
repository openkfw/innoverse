"use client";

import Box from "@mui/material/Box";

import Layout from "../components/layout/Layout";
import { NewsSection } from "@/components/landing/newsSection/NewsSection";
import { ProjectSection } from "@/components/landing/projectSection/ProjectSection";
import { FeaturedProjectSlider } from "@/components/landing/FeaturedProjectSlider";

function IndexPage() {
  return (
    <Layout>
      <Box
        sx={{
          marginRight: "10%",
          py: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FeaturedProjectSlider />
      </Box>
      <Box
        sx={{
          marginLeft: "8%",
          overflow: "hidden",
        }}
      >
        <ProjectSection />
        <NewsSection />
      </Box>
    </Layout>
  );
}

export default IndexPage;
