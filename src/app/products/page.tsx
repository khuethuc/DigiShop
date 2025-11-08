import { Suspense } from "react";
import Link from "next/link";
import { Pagination, Stack, Box, Skeleton } from "@mui/material";
import ProductCard from "@/components/product/ProductCard";
import CardSkeleton from "@/components/product/CardSkeleton";
import { fetchProductData } from "@/app/lib/product-action";

type Props = {
  searchParams: {
    page?: string;
  };
};

const PRODUCTS_PER_PAGE = 12;

async function ProductGrid({ page }: { page: number }) {
  const { products, total } = await fetchProductData(page, PRODUCTS_PER_PAGE);
  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);

  return (
    <>
      <Stack
        margin={{ xs: 1, md: 3 }}
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
        gap={{ xs: 2, md: 3, lg: 4 }}
      >
        {products.map((p) => (
          <Link
            key={p.product_id}
            href={`/products/${p.name.toLowerCase().replace(/\s+/g, "-")}`}
            style={{ textDecoration: "none" }}
          >
            <ProductCard
              image={p.image_url}
              title={p.name}
              price={p.discount_price ? p.discount_price : 0}
              oldPrice={p.discount_price ? p.original_price : undefined}
              discount={
                p.discount_price
                  ? `${Math.round((1 - p.discount_price / p.original_price) * 100)}%`
                  : undefined
              }
            />
          </Link>
        ))}
      </Stack>

      <Stack spacing={2} direction="row" justifyContent="center" my={4}>
        <Pagination
          count={totalPages}
          page={page}
          color="primary"
          siblingCount={1}
          boundaryCount={1}
        />
      </Stack>
    </>
  );
}

export default async function ProductPage({ searchParams }: Props) {
  const page = Number(searchParams.page ?? 1);

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
    <ProductGrid page={page} />
  </Suspense>  );
}
