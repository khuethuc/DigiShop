"use client";

import { useState } from "react";
import { Button, Stack, Typography } from "@mui/material";

type PackageSelectorProps = {
  options: string[]; // labels from database
  onSelect?: (selected: string) => void;
};

export default function PackageSelector({ options, onSelect }: PackageSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
    onSelect?.(option);
  };

  return (
    <Stack spacing={2}>
      <Typography fontWeight={700} variant="h6">
        Packages
      </Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap">
        {options.map((option) => (
          <Button
            key={option}
            variant={selected === option ? "contained" : "outlined"}
            color={selected === option ? "primary" : "inherit"}
            onClick={() => handleSelect(option)}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 0.5,
              px: 3,
              py: 1.5,
              boxShadow: selected === option ? 2 : 0,
              backgroundColor: selected === option ? "primary.main" : "transparent",
              color: selected === option ? "white" : "text.primary",
              "&:hover": {
                backgroundColor: selected === option ? "primary.dark" : "action.hover",
                borderColor: selected === option ? "none" : "black"
              },
              borderColor: "black"
            }}
          >
            {option}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
}
