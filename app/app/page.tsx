"use client";

import Box from "@mui/material/Box";

import { FeaturedProjectSlider } from "@/components/landing/FeaturedProjectSlider";
import Layout from "../components/layout/Layout";

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
    </Layout>
  );
}

export default IndexPage;
