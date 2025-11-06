"use client"
import { Stack, Box, Typography, Divider } from "@mui/material";
import KeywordTag from "@/components/home/KeywordTag";
import PackageSelector from "@/components/product/PackageSelector";
import Actions from "@/components/product/Action";

export type MainInfoProps = {
    title: string;
    quanity: number;
    category: string;
    discount_price: number | null;
    original_price: number;
    max_discount_price: number | null;
    max_original_price: number;
    types: [string]
};


export default function MainInfo(
    { title, quanity, category, discount_price, original_price, max_discount_price, max_original_price, types }: MainInfoProps
) 
{
    return(
        <Stack spacing={2.5}>
            {/* Main Info Section */}
            <Box>
                <Typography variant="h1" sx={{fontSize: {xs: 25, md: 35, lg: 40}, mb: 5}}>
                    {title}
                </Typography>

                <Typography variant="body1" gutterBottom>
                    Status: {quanity > 0 ? "In Stock" : "Out of stock"}
                </Typography>

                <Stack direction="row" sx={{marginBottom: 2}}>
                    <Typography variant="body1" gutterBottom>
                        Category: 
                    </Typography>
                    <KeywordTag label={category} size="md" mgLeft={3}/>
                </Stack>

                <Stack direction="row" spacing={5} mb={2}>
                {/* Discount Price */}
                {discount_price !== null || max_discount_price !== null ? (
                    <Typography
                    fontWeight={700}
                    sx={{ fontSize: { xs: 13, sm: 15, md: 17, lg: 18 } }}
                    >
                    {discount_price !== null ? discount_price.toLocaleString("en-US") : "-"} ₫
                    {max_discount_price !== null ? ` - ${max_discount_price.toLocaleString("en-US")} ₫` : ""}
                    </Typography>
                ) : null}

                {/* Original Price */}
                {original_price !== null || max_original_price !== null ? (
                    <Typography color="textDisabled" sx={{ textDecoration: "line-through" }}>
                    {original_price.toLocaleString("en-US")} ₫
                    {max_original_price !== null ? ` - ${max_original_price.toLocaleString("en-US")} ₫` : ""}
                    </Typography>
                ) : null}
                </Stack>
            </Box>

            <Divider sx={{borderColor: "#68686880", borderBottomWidth: 1}}/>

            {/* Packages */}
            <Stack direction="row">
                <PackageSelector options={types}
                onSelect={(pkg) => console.log("Selected:", pkg)}/>
            </Stack>

            <Divider sx={{borderColor: "#68686880", borderBottomWidth: 1}}/>

            {/*Actions */}
            <Box>
                <Actions />
            </Box>

        </Stack>
    )
}