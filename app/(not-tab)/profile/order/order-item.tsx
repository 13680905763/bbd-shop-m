import { Button, Divider } from "@heroui/react";

import ProductItem from "./product-item";

export default function OrderItem({ order, onPayOrderRedirect }: any) {
  return (
    <div className="rounded-box mb-3 p-2">
      <div className="flex items-center justify-between pb-2">
        <div># {order?.orderCode}</div>
        <div> {order?.createTime}</div>
      </div>
      <Divider />
      {order?.products.map((product: any, index: number) => (
        <ProductItem
          key={product.id}
          isLastProduct={index === order?.products.length - 1}
          product={product}
        />
      ))}
      <Divider />
      <div className="text-right">
        <p className="my-4">1件商品，应付金额 7.25</p>
        <Button
          color="primary"
          radius="full"
          onPress={() => {
            onPayOrderRedirect(order?.orderCode);
          }}
        >
          支付
        </Button>
      </div>
    </div>
  );
}
