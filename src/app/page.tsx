// app/page.tsx
"use client";

import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme";

import MainLayout from "@/components/layout/MainLayout";
import HeroBanner from "@/features/home/HeroBanner";
import ExploreProducts from "@/features/home/ExploreProducts";
import BestSellers from "@/features/home/BestSellers";
import CommonTags from "@/features/home/CommonTags";
import CustomersReviews from "@/features/home/CustomersReviews";

export default function HomePage() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MainLayout>
          <HeroBanner />
          <ExploreProducts />
          <BestSellers />
          <CommonTags />
          <CustomersReviews />
        </MainLayout>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
