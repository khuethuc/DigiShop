"use client";
import { Box, Container, Stack, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import CategoryTag from "../../components/home/CategoryTag";
import CarouselDots from "../../components/CarouselDots";

// ===== MOCK DATA =====
const items = [
  {
    image: "/images/ai-worlds.jpg",
    title: "AI Worlds",
    caption: "Siêu tối ưu",
  },
  {
    image: "/images/streaming.jpg",
    title: "Streaming",
    caption: "Netflix/Disney+",
  },
  {
    image: "/images/tools.jpg",
    title: "Productivity",
    caption: "Tools & Utilities",
  },
  { image: "/images/gaming.jpg", title: "Gaming", caption: "Steam, Xbox" },
  {
    image: "/images/music.jpg",
    title: "Music",
    caption: "Spotify/Apple Music",
  },
  {
    image: "/images/edu.jpg",
    title: "Education",
    caption: "Learning Platforms",
  },
];

export default function ExploreProducts() {
  const [idx, setIdx] = useState(0);
  const perView = 3;

  // số slide
  const slides = useMemo(
    () => Math.max(1, Math.ceil(items.length / perView)),
    [items.length, perView]
  );

  // chia items thành từng trang 3 card/slide
  const pages = useMemo(() => {
    const out: (typeof items)[] = [];
    for (let s = 0; s < slides; s++) {
      out.push(items.slice(s * perView, (s + 1) * perView));
    }
    return out;
  }, [slides]);

  const go = (delta: number) => setIdx((p) => (p + delta + slides) % slides);

  return (
    <Container sx={{ py: 4 }}>
      <Stack spacing={1.5} sx={{ mb: 1 }}>
        <Typography variant="h6" fontWeight={800}>
          Explore Our Products
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover premium digital accounts and services — instantly delivered,
          secure, and always available.
        </Typography>
      </Stack>

      <Box sx={{ position: "relative" }}>
        {/* Mobile: kéo ngang từng card */}
        <Box sx={{ display: { md: "none" }, overflowX: "auto", px: 0.5 }}>
          <Box
            sx={{
              display: "grid",
              gridAutoFlow: "column",
              gap: 2,
              scrollSnapType: "x mandatory",
              "& > *": { scrollSnapAlign: "start" },
            }}
          >
            {items.map((it, i) => (
              <Box key={i} sx={{ minWidth: 260 }}>
                <CategoryTag {...it} />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Desktop: carousel 3 card/slide */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            overflow: "hidden",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              transition: "transform .35s ease",
              width: `${slides * 100}%`,
              transform: `translateX(-${(idx * 100) / slides}%)`,
              gap: 2,
            }}
          >
            {pages.map((page, p) => (
              <Box key={p} sx={{ width: `${100 / slides}%` }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 2,
                  }}
                >
                  {page.map((it, i) => (
                    <CategoryTag key={`${p}-${i}`} {...it} />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <IconButton
          onClick={() => go(-1)}
          sx={{
            display: { xs: "none", md: "flex" },
            position: "absolute",
            top: "50%",
            left: -12,
            transform: "translateY(-50%)",
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          onClick={() => go(1)}
          sx={{
            display: { xs: "none", md: "flex" },
            position: "absolute",
            top: "50%",
            right: -12,
            transform: "translateY(-50%)",
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      <Box sx={{ display: { xs: "none", md: "block" }, mt: 1 }}>
        <CarouselDots count={slides} active={idx} onSelect={setIdx} />
      </Box>
    </Container>
  );
}
