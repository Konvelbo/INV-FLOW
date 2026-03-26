"use client";

import { useIPCData } from "@/hooks/useIPCData";
import ProductsClient from "./ProductsClient";
import Loading from "./loading";

export default function ProductsPage() {
  const { session, data: products, loading } = useIPCData<any[]>("products");

  if (loading || !session) {
    return <Loading />;
  }

  return (
    <ProductsClient 
      initialProducts={products || []} 
      userId={session.userId}
    />
  );
}
