import { useTheme, useMediaQuery, OutlinedInput, InputAdornment } from "@mui/material";
import { Search } from "lucide-react";

export default function SearchBar() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const iconSize = isSmall ? 18 : 22; // Responsive icon size
  const fontSize = isSmall ? 14 : 16; // Responsive placeholder font size

  return (
    <OutlinedInput
      placeholder="Search product name ..."
      startAdornment={
        <InputAdornment position="start">
          <Search size={iconSize} />
        </InputAdornment>
      }
      sx={{
        width: "min(620px, 100%)",
        height: 48,
        px: 2,
        borderRadius: 9999,
        bgcolor: "background.paper",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "divider",
        },
        "& input": {
          fontSize, // 👈 placeholder and input text size
        },
      }}
    />
  );
}
