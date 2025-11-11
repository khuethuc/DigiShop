"use client";

import { useState } from "react";
import { Button, Stack, Typography } from "@mui/material";

type PackageSelectorOption = {
  id: number;
  name: string;
};

type PackageSelectorProps = {
  options: PackageSelectorOption[];
  onSelect?: (selected: PackageSelectorOption) => void;
};

export default function PackageSelector({ options, onSelect }: PackageSelectorProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (option: PackageSelectorOption) => {
    setSelected(option.id);
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
            key={option.id}
            variant={selected === option.id ? "contained" : "outlined"}
            onClick={() => handleSelect(option)}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 0.5,
              px: 3,
              py: 1.5,
              boxShadow: selected === option.id ? 2 : 0,
            }}
          >
            {option.name}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
}


