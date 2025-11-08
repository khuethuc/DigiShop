import { Card, CardContent } from "@mui/material";
import Image from "next/image";
import type { ProductCardProps } from "./ProductCard";

export default function BigProductCard(
{title, image, price, oldPrice} : ProductCardProps
) {
    return(
        <Card sx={{display: "flex"}}>

        </Card>
    )
}