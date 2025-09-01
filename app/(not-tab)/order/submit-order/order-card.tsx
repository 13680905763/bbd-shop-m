import { Product } from "./page";
import ProductItem from "./product-item";

import SourceIcon from "@/components/common/source-icon";

export default function OrderCard({ order, openServiceModal }: any) {
  return (
    <div className="rounded-box mb-3 px-2 py-3">
      <div className="flex items-center gap-2">
        <SourceIcon source={order?.source} />
        <div className="text-title">{order?.shopName}</div>
      </div>

      {order.products.map((product: Product) => (
        <ProductItem
          key={product?.sku?.propName_valueName}
          openServiceModal={openServiceModal}
          product={product}
        />
      ))}
    </div>
  );
}
