"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Box, Container, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

// ===== MOCK DATA (thay bằng API sau) =====
const slides = [
  { src: "/netflix.jpeg", alt: "Netflix Promo" },
  { src: "/youtube.jpeg", alt: "Unlimited Shows" },
];

export default function HeroBanner() {
  const intervalMs = 5000;
  const height = { xs: 200, md: 360 };
  const rounded = 0;

  const [idx, setIdx] = useState(0);
  const count = useMemo(() => Math.max(slides.length, 1), []);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hoveringRef = useRef(false);
  const startX = useRef<number | null>(null);
  const deltaX = useRef(0);

  const go = (n: number) => setIdx((p) => (n + count) % count);
  const next = useCallback(() => {
    setIdx((p) => (p + 1) % count);
  }, [count]);
  const prev = useCallback(() => {
    setIdx((p) => (p - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1 || hoveringRef.current) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next, intervalMs, count]);

  const onMouseEnter = () => {
    hoveringRef.current = true;
    timerRef.current && clearInterval(timerRef.current);
  };
  const onMouseLeave = () => {
    hoveringRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, intervalMs);
  };

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    startX.current = e.touches[0].clientX;
    deltaX.current = 0;
    onMouseEnter();
  };
  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (startX.current == null) return;
    deltaX.current = e.touches[0].clientX - startX.current;
  };
  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    if (Math.abs(deltaX.current) > 40) deltaX.current < 0 ? next() : prev();
    startX.current = null;
    deltaX.current = 0;
    onMouseLeave();
  };

  return (
    <Box component="section" sx={{ bgcolor: "background.default" }}>
      <Container maxWidth="xl" disableGutters>
        <Box
          tabIndex={0}
          aria-label="Hero banner"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          sx={{
            position: "relative",
            height: { xs: height.xs ?? 180, md: height.md ?? 360 },
            borderRadius: rounded,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: `${count * 100}%`,
              height: "100%",
              display: "flex",
              transform: `translateX(-${(idx * 100) / count}%)`,
              transition: "transform .5s ease",
            }}
          >
            {slides.map((s, i) => (
              <Box
                key={i}
                sx={{
                  position: "relative",
                  width: `${100 / count}%`,
                  height: "100%",
                }}
              >
                <Image
                  src={s.src}
                  alt={s.alt ?? `Slide ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  style={{ objectFit: "cover" }}
                />
              </Box>
            ))}
          </Box>

          {count > 1 && (
            <>
              <IconButton
                onClick={prev}
                aria-label="Previous slide"
                sx={(t) => ({
                  position: "absolute",
                  top: "50%",
                  left: 8,
                  transform: "translateY(-50%)",
                  bgcolor: t.palette.background.paper,
                  border: `1px solid ${t.palette.divider}`,
                  display: { xs: "none", md: "flex" },
                })}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={next}
                aria-label="Next slide"
                sx={(t) => ({
                  position: "absolute",
                  top: "50%",
                  right: 8,
                  transform: "translateY(-50%)",
                  bgcolor: t.palette.background.paper,
                  border: `1px solid ${t.palette.divider}`,
                  display: { xs: "none", md: "flex" },
                })}
              >
                <ChevronRight />
              </IconButton>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
}
