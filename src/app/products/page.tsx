import { Suspense } from "react";
import Link from "next/link";
import { Pagination, Stack, Box, Skeleton } from "@mui/material";
import ProductCard from "@/components/product/ProductCard";
import CardSkeleton from "@/components/product/CardSkeleton";
import { fetchProductData } from "@/app/lib/product-action";
import ProductPagination from "@/components/product/ProductPagination";


export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const metadata = {
  title: "Products",
  description:
    "Product List of all available items",
};

type Props = {
  searchParams: Promise<{
    page?: string;
    category?: string;
  }>;
};

const PRODUCTS_PER_PAGE = 12;

async function ProductGrid({
  page,
  category,
}: {
  page: number;
  category?: string;
}) {
  const { products, total } = await fetchProductData(
    page,
    PRODUCTS_PER_PAGE,
    category
  );
  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);

  return (
    <>
      <Box
        sx={{
          px: { xs: 2, sm: 3, md: 8, lg: 14 },
          py: { xs: 2, md: 3 },
          mx: "auto",
          maxWidth: 1900,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 320px))", // wider cards
          justifyContent: "center",
          columnGap: { xs: 3.5, md: 5, lg: 6 },               // keep nice spacing
          rowGap: { xs: 2.25, md: 2.75 },
        }}
      >
        {products.map((p) => (
          <Link
            key={p.product_id}
            href={`/products/${p.name.toLowerCase().replace(/\s/g, "-")}`}
            style={{ textDecoration: "none" }}
          >
            <ProductCard
              image={p.image_url}
              title={p.name}
              price={p.discount_price ? p.discount_price : 0}
              oldPrice={p.discount_price ? p.original_price : undefined}
              discount={
                p.discount_price
                  ? `${Math.round(
                      (1 - p.discount_price / p.original_price) * 100
                    )}%`
                  : undefined
              }
            />
          </Link>
        ))}
      </Box>
      <Stack spacing={2} direction="row" justifyContent="center" my={4}>
        <ProductPagination page={page} totalPages={totalPages} />
      </Stack>
    </>
  );
}

export default async function ProductPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Number(sp.page ?? 1);
  const category = sp.category ? decodeURIComponent(sp.category) : undefined;

  return (
    <Suspense
      fallback={
        <Stack
          spacing={2}
          mb={4}
          direction="row"
          flexWrap="wrap"
          justifyContent="center"
          gap={{ xs: 2, md: 3, lg: 4 }}
        >
          {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </Stack>
      }
    >
      <ProductGrid page={page} category={category} />
    </Suspense>
  );
}
