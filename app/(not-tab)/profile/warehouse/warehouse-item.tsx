import { Checkbox } from "@heroui/react";

import ProductItem from "./product-item";

export default function OrderItem({
  warehouse,
  onPayOrderRedirect,
  onCancelOrder,
  activeTab,
  onChange,
  selected,
}: any) {
  return (
    <div className="mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* 顶部：订单号 + 下单时间 */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        {activeTab === "submit" ? (
          <Checkbox isSelected={selected} onChange={onChange} />
        ) : null}
        <div className="text-sm font-medium text-gray-800">
          订单号：<span className="font-semibold">{warehouse?.orderCode}</span>
        </div>
        <div className="text-xs text-gray-500">{warehouse?.createTime}</div>
      </div>

      {/* 商品列表 */}
      <div className="">
        <ProductItem
          key={warehouse?.orderProduct.id}
          product={warehouse?.orderProduct}
          warehouse={warehouse}
        />
      </div>

      {/* 金额 + 按钮 */}
      <div className="mt-3 text-right">
        <p className="my-2 text-sm text-gray-700">
          <span className="text-lg font-bold text-[#f0700c]">
            {warehouse?.status}
          </span>
        </p>

        {/* {warehouse?.status === "待付款" && (
          <div className="space-x-2">
            <Button
              color="primary"
              radius="sm"
              size="sm"
              onPress={() => {
                onPayOrderRedirect(warehouse?.orderCode);
              }}
            >
              支付
            </Button>
            <Button
              radius="sm"
              size="sm"
              variant="flat"
              onPress={() => {
                onCancelOrder(warehouse?.id);
              }}
            >
              取消
            </Button>
          </div>
        )} */}
      </div>
    </div>
  );
}
