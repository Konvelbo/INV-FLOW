import { getServerSession } from "@/lib/session";
import { getProductsData } from "@/lib/data-fetching/products";
import ProductsClient from "./ProductsClient";
import { Suspense } from "react";
import Loading from "../loading";
import { redirect } from "next/navigation";

export default async function ProductsPage() {
  const session = await getServerSession();

  if (!session?.userId) {
    redirect("/");
  }

  const products = await getProductsData(session.userId);

  return (
    <Suspense fallback={<Loading />}>
      <ProductsClient initialProducts={products} />
    </Suspense>
  );
}
