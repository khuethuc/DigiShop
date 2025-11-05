"use client";
import { Box, Typography, Card, CardActionArea } from "@mui/material";

export type CategoryTagProps = {
  image: string;
  title: string;
  caption?: string;
  onClick?: () => void;
  /** "md" | "lg" – kích thước tile */
  size?: "md" | "lg";
};

export default function CategoryTag({
  image,
  title,
  caption,
  onClick,
  size = "lg",
}: CategoryTagProps) {
  const preset =
    size === "lg"
      ? {
          radius: 3,
          imgMinH: { xs: 160, md: 200 },
          pad: 2,
          titleVar: "subtitle1" as const,
        }
      : {
          radius: 2,
          imgMinH: { xs: 140, md: 160 },
          pad: 1.5,
          titleVar: "body1" as const,
        };

  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: preset.radius,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden", // để ảnh bo theo card
        transition: "transform .2s ease, box-shadow .2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: (t) => t.shadows[3],
        },
      }}
    >
      <CardActionArea onClick={onClick} sx={{ display: "block" }}>
        {/* Banner image lớn */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9", // giữ form ảnh giống mock
            minHeight: preset.imgMinH, // đảm bảo đủ độ cao
            bgcolor: "grey.100",
          }}
        >
          <Box
            component="img"
            src={image}
            alt={title}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>

        {/* Text dưới ảnh */}
        <Box sx={{ px: preset.pad, py: preset.pad }}>
          <Typography variant={preset.titleVar} fontWeight={800} align="center">
            {title}
          </Typography>
          {caption && (
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              sx={{ mt: 0.25 }}
            >
              {caption}
            </Typography>
          )}
        </Box>
      </CardActionArea>
    </Card>
  );
}
