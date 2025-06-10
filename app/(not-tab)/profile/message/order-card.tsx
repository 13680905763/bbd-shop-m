import { Product, Shop } from "./page";
import ProductItem from "./product-item";

type ShopCardProps = {
  shop: Shop;
};

export default function OrderCard({ shop }: ShopCardProps) {
  return (
    <div className="rounded-box mb-3 px-2 py-3">
      <div className="flex items-center gap-2">
        <div className="text-title !text-base">{shop?.shopName}</div>
      </div>

      {shop.cartList.map((product: Product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
}
