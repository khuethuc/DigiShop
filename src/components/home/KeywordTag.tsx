"use client";
import { Chip } from "@mui/material";

export type KeywordTagProps = {
  label: string;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info";
  onClick?: () => void;
  /** "md" | "lg" | "xl" */
  size?: "md" | "lg" | "xl";
  /** Bo góc nhỏ (vuông vức) thay vì pill */
  square?: boolean;
  mgLeft?: number
};

export default function KeywordTag({
  label,
  color = "primary",
  onClick,
  size = "lg",
  square = true,
  mgLeft = 0
}: KeywordTagProps) {
  const preset = {
    md: { h: 44, px: 1, py: 2, font: 16, minW: 100, radius: 1 }, // 8px
    lg: { h: 56, px: 2.5, font: 18, minW: 120, radius: 2 }, // 8px
    xl: { h: 64, px: 3, font: 20, minW: 140, radius: 2 }, // 8px
  }[size];

  return (
    <Chip
      label={label}
      color={color}
      onClick={onClick}
      variant="filled"
      sx={{
        height: preset.h,
        px: preset.px,
        minWidth: preset.minW,
        borderRadius: square ? preset.radius : 9999,
        boxShadow: 2,
        fontWeight: 700,
        "& .MuiChip-label": {
          px: 0, // loại bỏ padding thừa của label
          fontSize: preset.font,
          fontWeight: 700,
        },
        marginLeft: mgLeft
      }}
    />
  );
}
