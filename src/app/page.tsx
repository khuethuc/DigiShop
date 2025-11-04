"use client";
import HeroBanner from "@/features/home/HeroBanner";
import ExploreProducts from "@/features/home/ExploreProducts";
import BestSellers from "@/features/home/BestSellers";
import CommonTags from "@/features/home/CommonTags";
import CustomersReviews from "@/features/home/CustomersReviews";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <ExploreProducts />
      <BestSellers />
      <CommonTags />
      <CustomersReviews />
    </>
  );
}