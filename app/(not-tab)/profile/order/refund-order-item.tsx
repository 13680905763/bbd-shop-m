import { useTranslations } from "next-intl";

import { useGlobalStore } from "@/store";
import SourceIcon from "@/components/common/source-icon";
import { ProductItem } from "@/components/common";

export default function RefundOrderItem({ order }: any) {
  const t = useTranslations("profile.order"); // ✅ 命名空间

  const { currency } = useGlobalStore();

  return (
    <div className="space-y-2 rounded-xl bg-white p-3 shadow-sm">
      {/* 顶部：订单号 + 下单时间 */}
      <div className="flex items-center justify-between border-gray-100">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
          <SourceIcon source={order.source} />
          <div className="font-semibold">
            {order?.orderCode}
            <div className="text-xs text-gray-500">{order?.createTime}</div>
          </div>
        </div>
        <div className="self-start text-right text-sm font-bold text-[#f0700c]">
          {order?.status}
        </div>
      </div>

      <ProductItem key={order?.id} product={order} />

      {/* 底部信息（退款部分） */}
      <div className="space-y-1 text-sm text-gray-600">
        <div className="flex justify-between">
          <span className="w-[200px]">{t("refundReason")}</span>
          <span className="ellipsis line-clamp-2 break-words">
            {order.applyRemark || "--"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="w-[200px]">{t("reviewReason")}</span>
          <span className="ellipsis line-clamp-2 break-words">
            {order.handleRemark || "--"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="w-[200px]">{t("refundAmount")}</span>
          <span>
            {currency.symbol}
            {order.refundAmount || 0}
          </span>
        </div>
        <div className="flex justify-between">
          <span>{t("reviewTime")}</span>
          <span>{order.updateTime || "--"}</span>
        </div>
      </div>
    </div>
  );
}
