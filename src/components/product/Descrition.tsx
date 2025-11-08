// Description.tsx
import { Box, Typography, Stack } from "@mui/material";

export type DescriptionProps = {
  info: string | null | undefined;
  order_fulfillment: string | null | undefined;
  warranty_period: string | null | undefined;
  warranty_method: string | null | undefined;
};

export default function Description({
  info,
  order_fulfillment,
  warranty_period,
  warranty_method,
}: DescriptionProps) {
  const defaultText = "No information available."; // Fallback text for missing values

  return (
    <Stack spacing={{ xs: 2, md: 4, lg: 6 }}>
      <Box sx={{ maxWidth: 900, width: "100%" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Product Information & Usage Policy
        </Typography>
        <Typography
          variant="body1"
          sx={{ whiteSpace: "pre-line", paddingLeft: 2 }}
        >
          {info || defaultText}
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 900, width: "100%" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Order Fulfillment Process
        </Typography>
        <Typography
          variant="body1"
          sx={{ whiteSpace: "pre-line", paddingLeft: 2 }}
        >
          {order_fulfillment || defaultText}
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 900, width: "100%" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Warranty Policy
        </Typography>
        <Typography variant="body1" sx={{ paddingLeft: 2 }}>
          Warranty Period: {warranty_period || defaultText}
        </Typography>
        <Typography
          variant="body1"
          sx={{ whiteSpace: "pre-line", paddingLeft: 2 }}
        >
          Warranty Method: {warranty_method || defaultText}
        </Typography>
      </Box>
    </Stack>
  );
}
