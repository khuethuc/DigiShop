import { Box, Stack, Typography } from "@mui/material";
import Description from "@/components/product/Descrition";
import {
  getProductByName,
  getProductTypesByProductId,
  getProductCategoryById,
} from "@/app/lib/product-action";
import Image from "next/image";
import MainInfo from "@/components/product/MaiInfo";
import Comment from "@/components/product/Comment";

type PageProps = {
  params: { name: string };
};

export default async function ProductDetail(props: PageProps) {
  const { params } = props;
  const { name } = await params;
  const formattedName = name.replace(/-/g, " ");
  let product: any,
    product_types: { product_type_id: number, type: string }[] = [],
    category = "Uncategorized"; // Default fallback

  try {
    // Fetch product data first
    product = await getProductByName(formattedName);

    // Ensure product exists before fetching related data
    if (product) {
      // Fetch product types and category concurrently
      const [fetchedProductTypes, fetchedCategory] = await Promise.all([
        getProductTypesByProductId(product.product_id),
        getProductCategoryById(product.product_id),
      ]);

      product_types = fetchedProductTypes || [];
      category = fetchedCategory || "Uncategorized";
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
    return (
      <Typography variant="h6" color="error">
        Something went wrong while loading product details.
      </Typography>
    );
  }

  // Check if product is found
  if (!product) {
    return (
      <Typography variant="h6" color="error">
        Product not found
      </Typography>
    );
  }

  return (
    <Stack 
      sx={{
        paddingY: {xs: 2, sm: 3, md: 5, lg: 7},
        paddingX: { xs: 3, sm: 5, md: 8, lg: 20, xl: 22 },
        width: "100%"
      }}
      spacing={8}
      alignItems="center"
    >
      <Box sx={{ maxWidth: 900, width: '100%' }}>
        <Stack direction={"row"} spacing={5} flexWrap="wrap">
          <Image
            src={product.image_url || "/default-image.png"} // Fallback image
            alt={product.name}
            width={400}
            height={400}
            style={{ objectFit: "contain", borderRadius: 15 }}
          />

          {/* Main Info */}
          <MainInfo
            title={product.name}
            quantity={Number(product.stock)}
            discount_price={product.discount_price || null}
            original_price={product.original_price}
            category={category}
            types={product_types.map((p) => ({
                  id: p.product_type_id,
                  name: p.type,
            }))}
            max_discount_price={product.max_discount_price || null}
            max_original_price={product.max_original_price || null} // Ensuring max_original_price is never undefined
          />
        </Stack>
      </Box>

      {/* Description */}
      <Description
        info={product.info || "No description available."} // Fallback text for missing info
        order_fulfillment={
          product.order_fulfillment || "No order fulfillment details."
        } // Fallback
        warranty_period={
          product.warranty_period || "No warranty period provided."
        } // Fallback
        warranty_method={
          product.warranty_method || "No warranty method provided."
        } // Fallback
      />

      <Comment/>
    </Stack>
  );
}
