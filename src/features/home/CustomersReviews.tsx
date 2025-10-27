"use client";
import { Box, Container, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import CommentCard from "../../components/home/CommentCard";
import CarouselDots from "../../components/CarouselDots";

// ===== MOCK DATA =====
const items = [
  {
    content: "Got my account instantly after payment. Smooth and hassle-free!",
    author: "Meow meow",
    avatar: "/images/avatar1.jpg",
  },
  {
    content:
      "Everything worked perfectly from the first login. Highly recommended!",
    author: "Meow meow",
    avatar: "/images/avatar2.jpg",
  },
  {
    content: "Fast delivery and great support. Will buy again.",
    author: "Meow meow",
    avatar: "/images/avatar3.jpg",
  },
  {
    content: "Nice price, reliable service.",
    author: "Meow meow",
    avatar: "/images/avatar4.jpg",
  },
];

export default function CustomersReviews() {
  const perView = 3;

  // Chunk items -> pages
  const pages = useMemo(() => {
    const out: (typeof items)[] = [];
    for (let i = 0; i < items.length; i += perView)
      out.push(items.slice(i, i + perView));
    return out.length ? out : [[]];
  }, []);

  const slides = pages.length;
  const [idx, setIdx] = useState(0);
  const go = (n: number) => setIdx((p) => (n + slides) % slides);

  // 👇 Padding section (chỉ padding, không đổi height card)
  const padY = { xs: 2, md: 3 }; // py của section
  const padX = { xs: 2, md: 3 }; // px của section
  const gapBetweenCards = 1.5; // khoảng cách giữa các card
  const titleMb = 1; // margin dưới tiêu đề (nhỏ hơn)

  return (
    <Container sx={{ py: padY }}>
      <Typography variant="h6" fontWeight={800} sx={{ mb: titleMb }}>
        What Our Customers Say
      </Typography>

      <Box sx={{ position: "relative" }}>
        {/* Viewport */}
        <Box sx={{ overflow: "hidden" }}>
          {/* Track */}
          <Box
            sx={{
              display: { xs: "block", md: "flex" },
              width: { md: `${slides * 100}%` },
              transform: {
                xs: "none",
                md: `translateX(-${(idx * 100) / slides}%)`,
              },
              transition: { md: "transform .35s ease" },
            }}
          >
            {pages.map((page, pi) => (
              <Box key={pi} sx={{ width: { md: `${100 / slides}%` } }}>
                {/* Grid cards */}
                <Box
                  sx={{
                    display: "grid",
                    gridAutoFlow: { xs: "column", md: "row" },
                    gridTemplateColumns: { md: `repeat(${perView}, 1fr)` },
                    gap: gapBetweenCards,
                    px: { xs: 0.5, md: 0 },
                    py: { xs: 0.5, md: 1 },
                    overflowX: { xs: "auto", md: "visible" },
                    scrollSnapType: { xs: "x mandatory", md: "none" },
                  }}
                >
                  {page.map((it, i) => (
                    <Box
                      key={`${pi}-${i}`}
                      sx={{
                        minWidth: { xs: 260, md: "auto" },
                        scrollSnapAlign: { xs: "start", md: "initial" },
                      }}
                    >
                      <CommentCard {...it} />
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Arrows md+ (ẩn nếu 1 trang) */}
        {slides > 1 && (
          <>
            <IconButton
              onClick={() => go(idx - 1)}
              sx={{
                display: { xs: "none", md: "flex" },
                position: "absolute",
                top: "50%",
                left: -10, // sát hơn một chút
                transform: "translateY(-50%)",
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
              aria-label="Previous"
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={() => go(idx + 1)}
              sx={{
                display: { xs: "none", md: "flex" },
                position: "absolute",
                top: "50%",
                right: -10, // sát hơn một chút
                transform: "translateY(-50%)",
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
              aria-label="Next"
            >
              <ChevronRight />
            </IconButton>
          </>
        )}
      </Box>

      {/* Dots md+ (ẩn nếu 1 trang) */}
      {slides > 1 && (
        <Box sx={{ display: { xs: "none", md: "block" }, mt: 1 }}>
          <CarouselDots count={slides} active={idx} onSelect={setIdx} />
        </Box>
      )}
    </Container>
  );
}
