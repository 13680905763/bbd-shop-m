import { Button, Divider } from "@heroui/react";

import ProductItem from "./product-item";

export default function OrderItem({ order, onPayOrderRedirect }: any) {
  return (
    <div className="rounded-box mb-3 p-3">
      <div className="flex items-center justify-between pb-3">
        <div># {order?.orderCode}</div>
        <div className="text-light-gray"> {order?.createTime}</div>
      </div>
      <Divider />
      {order?.products.map((product: any, index: number) => (
        <ProductItem
          key={product.id}
          customerPayStatus={order?.customerPayStatus}
          isLastProduct={index === order?.products.length - 1}
          product={product}
        />
      ))}
      <Divider />
      <div className="text-right">
        <p className="my-2">
          <span className="text-light-gray">
            <span>
              {order?.customerPayStatus === "待付款" ? "应付" : "已付"}
            </span>
            金额：
          </span>
          {order?.totalFee}
        </p>
        {order?.customerPayStatus === "待付款" ? (
          <Button
            color="primary"
            radius="none"
            size="sm"
            onPress={() => {
              onPayOrderRedirect(order?.orderCode);
            }}
          >
            支付
          </Button>
        ) : null}
      </div>
    </div>
  );
}
