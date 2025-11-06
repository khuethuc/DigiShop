import { Box, Stack} from "@mui/material";
import Description from "@/components/product/Descrition";
import { getProductByName, getProductTypesById, getProductCategoryById } from "@/app/lib/product-action";
import Image from "next/image";
import MainInfo from "@/components/product/MaiInfo";

type PageProps = {
  params: { name: string }; // Next.js passes this automatically
};

export default async function ProductDetail({params} : PageProps) {
  const resolvedParams = await params; 
  const name = resolvedParams.name.replace(/-/g, " ");
  const product = await getProductByName(name);
  const product_types = await getProductTypesById(product?.product_id || 0);
  const category = await getProductCategoryById(product?.product_id || 0);

  if (!product) return <div>Product not found</div>;

  return (
    <Stack 
      sx={{paddingY: {xs: 2, sm: 3, md: 5, lg: 7}, paddingX: { xs: 3, sm: 5, md: 8, lg: 20, xl: 22 } }}
      spacing={20}
      alignItems="center"
    >
      <Box sx={{ maxWidth: 900, width: '100%' }}>
        <Stack direction={"row"} spacing={5}>
          <Image
            src={product.image_url}
            alt={product.name}
            width={400}
            height={400}
            style={{ objectFit: "contain", borderRadius: 15 }}
          />
          
          <MainInfo 
            title={product.name}
            quanity={Number(product.stock)}
            discount_price={product.discount_price || null}
            original_price={product.original_price}
            category={category}
            types={product_types.map((p) => p.type)} 
            max_discount_price={product.max_discount_price || null}
            max_original_price={product.max_original_price}
          />

        </Stack>

      </Box>
      
      <Description
        info={product.info || ""}
        od_ffment={product.order_fulfillment || ""}
        wr_period={product.warranty_period || ""}
        wr_method={product.warranty_method || ""}  
      />
    </Stack>
  );
}