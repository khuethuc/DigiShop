import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Divider, Stack } from '@mui/material';

export type DescriptionProps = {
    info: string;
    od_ffment: string;
    wr_period: string;
    wr_method: string;
};

export default function Description(
    { info, od_ffment, wr_period, wr_method }: DescriptionProps) {
    
    return (
        <Stack
        spacing={{ xs: 2, md: 4, lg: 6 }}
        >
        <Box sx={{ maxWidth: 900, width: '100%'}}>
            <Typography variant="h6" sx={{ mb: 2 }}>
            Product Information & Usage Policy
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', paddingLeft:2 }}>
            {info}
            </Typography>
        </Box>

        <Box sx={{ maxWidth: 900, width: '100%',  }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
            Order Fulfillment Process
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', paddingLeft:2 }}>
            {od_ffment}
            </Typography>
        </Box>

        <Box sx={{ maxWidth: 900, width: '100%',  }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
            Warranty Policy
            </Typography>
            <Typography variant="body1" sx={{paddingLeft:2}}>
            Warranty Period: {wr_period}
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', paddingLeft:2 }}>
            Warranty Method: {wr_method}
            </Typography>
        </Box>
        </Stack>
    )
}