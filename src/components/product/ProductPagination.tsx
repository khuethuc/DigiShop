"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@mui/material";

export default function ProductPagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (_: any, value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", value.toString());

    router.push(`?${params.toString()}`);
  };

  return (
    <Pagination
      count={totalPages}
      page={page}
      onChange={handleChange}
      color="primary"
      siblingCount={1}
      boundaryCount={1}
    />
  );
}
