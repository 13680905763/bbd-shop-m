import { Image } from "@heroui/react";
import { useTranslation } from "react-i18next";

import { useGlobalStore } from "@/store";
import SourceIcon from "@/components/common/source-icon";

export default function OrderRefundItem({ order }: any) {
  const { t } = useTranslation("translation", {
    keyPrefix: "profile.order",
  });
  const { currency } = useGlobalStore();

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      {/* 顶部：订单号 + 下单时间 */}
      <div className="flex items-center justify-between border-gray-100">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
          <SourceIcon source={order.source} />
          <div className="font-semibold">
            {order?.orderCode}
            <div className="text-xs text-gray-500">{order?.createTime}</div>
          </div>
        </div>
      </div>

      {/* 商品列表 */}
      <div className="my-3 flex gap-3">
        <Image
          alt="商品图"
          className="rounded-lg object-cover shadow-sm"
          height={80}
          referrerPolicy="no-referrer"
          src={order.skuPicUrl || order?.picUrl}
          width={80}
        />

        {/* 商品信息 */}
        <div className="flex-1">
          <div className="line-clamp-2 text-sm font-semibold text-gray-900">
            {order.productTitle}
          </div>
          <div className="line-clamp-2 text-xs text-gray-500">
            {order.propAndValue?.propName_valueName}
          </div>
        </div>
      </div>

      {/* 底部信息（退款部分） */}
      <div className="mt-3 space-y-1 border-t pt-3 text-xs text-gray-600">
        <div className="flex justify-between">
          <span>{t("refundReason")}</span>
          <span>{order.applyRemark || "--"}</span>
        </div>
        <div className="flex justify-between">
          <span>{t("reviewReason")}</span>
          <span>{order.handleRemark || "--"}</span>
        </div>
        <div className="flex justify-between">
          <span>{t("refundAmount")}</span>
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
