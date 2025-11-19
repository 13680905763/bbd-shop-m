import { Button, Checkbox } from "@heroui/react";

import ProductItem from "./product-item";

import SourceIcon from "@/components/common/source-icon";

export default function OrderItem({
  order,
  onPayOrderRedirect,
  onCancelOrder,
  activeTab,
  onChange,
  selected,
  onRequestRefund,
  texts,
}: any) {
  return (
    <div className="mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* 顶部：订单号 + 下单时间 */}
      <div className="flex items-center border-gray-100">
        {activeTab === "waitPay" ? (
          <Checkbox isSelected={selected} onChange={onChange} />
        ) : null}

        <div className="flex gap-2 text-sm font-medium text-gray-800">
          <SourceIcon source={order.source} />
          <div className="font-semibold">
            {order?.orderCode}
            <div className="flex-1 text-xs text-gray-500">
              {order?.createTime}
            </div>
          </div>
        </div>
      </div>

      {/* 商品列表 */}
      <div className="divide-y divide-gray-100">
        {order?.products.map((product: any, index: number) => (
          <ProductItem
            key={product.id}
            customerPayStatus={order?.customerPayStatus}
            isLastProduct={index === order?.products.length - 1}
            product={product}
            status={order.status}
          />
        ))}
      </div>

      {/* 金额 + 按钮 */}
      <div className="mt-3 text-right">
        <p className="my-2 text-sm text-gray-700">
          {/* <span className="mr-1">金额：</span> */}
          <span className="text-lg font-bold text-[#f0700c]">
            ￥{order?.totalFee}
          </span>
        </p>

        {order?.statusCode === 101 && (
          <div className="space-x-2">
            <Button
              color="primary"
              radius="sm"
              size="sm"
              onPress={() => {
                onPayOrderRedirect(order?.orderCode);
              }}
            >
              {texts.pay}
            </Button>
            <Button
              radius="sm"
              size="sm"
              variant="flat"
              onPress={() => {
                onCancelOrder(order?.id);
              }}
            >
              {texts.cancel}
            </Button>
          </div>
        )}
        {order?.statusCode === 102 && (
          <Button
            color="primary"
            radius="sm"
            size="sm"
            onPress={() => {
              onRequestRefund();
            }}
          >
            {texts.requestRefund}
          </Button>
        )}
      </div>
    </div>
  );
}
