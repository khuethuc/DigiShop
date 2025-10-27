"use client";
import { Stack, IconButton } from "@mui/material";

export default function CarouselDots({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
      {Array.from({ length: count }).map((_, i) => (
        <IconButton
          key={i}
          size="small"
          onClick={() => onSelect(i)}
          sx={(t) => ({
            width: 8,
            height: 8,
            p: 0.5,
            borderRadius: "50%",
            bgcolor:
              i === active ? t.palette.primary.main : t.palette.action.disabled,
          })}
        />
      ))}
    </Stack>
  );
}
