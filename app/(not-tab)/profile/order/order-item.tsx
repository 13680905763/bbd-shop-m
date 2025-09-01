import { Button, Checkbox } from "@heroui/react";

import ProductItem from "./product-item";

export default function OrderItem({
  order,
  onPayOrderRedirect,
  onCancelOrder,
  activeTab,
  onChange,
  selected,
  onRequestRefund,
}: any) {
  return (
    <div className="mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* 顶部：订单号 + 下单时间 */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        {activeTab === "waitPay" ? (
          <Checkbox isSelected={selected} onChange={onChange} />
        ) : null}
        <div className="text-sm font-medium text-gray-800">
          订单号：<span className="font-semibold">{order?.orderCode}</span>
        </div>
        <div className="text-xs text-gray-500">{order?.createTime}</div>
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
          <span className="mr-1">金额：</span>
          <span className="text-lg font-bold text-[#f0700c]">
            ￥{order?.totalFee}
          </span>
        </p>

        {order?.status === "待付款" && (
          <div className="space-x-2">
            <Button
              color="primary"
              radius="sm"
              size="sm"
              onPress={() => {
                onPayOrderRedirect(order?.orderCode);
              }}
            >
              支付
            </Button>
            <Button
              radius="sm"
              size="sm"
              variant="flat"
              onPress={() => {
                onCancelOrder(order?.id);
              }}
            >
              取消
            </Button>
          </div>
        )}
        {order?.status === "待采购" && (
          <Button
            color="primary"
            radius="sm"
            size="sm"
            onPress={() => {
              onRequestRefund(order?.id);
            }}
          >
            申请退款
          </Button>
        )}
      </div>
    </div>
  );
}
