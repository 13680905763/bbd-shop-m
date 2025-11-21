import { Checkbox, Image } from "@heroui/react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { useTranslations } from "next-intl";

import MediaPreviewGroup, {
  MediaItem,
} from "@/components/common/media-preview";

export default function PackageItem({
  pack,
  activeTab,
  onChange,
  selected,
  onRequestRefund,
  onRequestWithdraw,
  onRequestChange,
  onRequestLine,
}: any) {
  const t = useTranslations("profile.package.packageItem");

  const router = useRouter();

  return (
    <div className="mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* 顶部：包裹号 + 创建时间 */}
      <div className="flex items-center pb-2">
        {activeTab === "pay" ? (
          <Checkbox isSelected={selected} onChange={onChange} />
        ) : null}
        <div className="text-sm font-medium text-gray-800">
          <span className="font-semibold">{pack?.packingPackageCode}</span>
          <div className="text-xs text-gray-500">{pack?.createTime}</div>
        </div>
      </div>

      {/* 包裹商品列表 */}
      <div className="flex gap-2">
        <div
          className={`grid h-[120px] w-[120px] gap-1`}
          style={{
            gridTemplateColumns: `repeat(${
              pack.packageItemList.length === 1
                ? 1
                : pack.packageItemList.length === 2 ||
                    pack.packageItemList.length === 4
                  ? 2
                  : 3
            }, minmax(0, 1fr))`,
          }}
        >
          {pack.packageItemList.map((item: any) => {
            return (
              <Image
                key={item.id}
                alt="product"
                radius="none"
                src={
                  item?.orderProduct?.skuPicUrl || item?.orderProduct?.picUrl
                }
              />
            );
          })}
        </div>

        {/* 商品信息 */}
        <div className="flex-1">
          {/* 重量 & 尺寸 */}
          <div className="flex flex-col gap-1">
            <div className="text-sm font-semibold">
              {t("weight")}：<span className="ml-1">{pack?.weight} g</span>
            </div>
            <div className="text-sm text-gray-600">
              {t("size")}：{pack?.length} × {pack?.width} × {pack?.height} cm
            </div>
            <div className="flex flex-col gap-1 text-sm text-gray-600">
              {/* <p>{pack?.shipping?.methodCode}</p> */}
              <p>{pack?.shipping?.templateName}</p>
              {/* 物流信息 */}
              {pack?.shipping?.shippingCode && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="flex flex-1 flex-col">
                    <span
                      className="text-gray-500"
                      role="button"
                      onClick={onRequestLine}
                    >
                      <FiSearch
                        className="mr-1 inline-block text-gray-500"
                        size={14}
                      />
                      {t("shippingCode")}
                    </span>
                    <span className="break-all font-medium text-gray-900">
                      {pack.shipping.shippingCode}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 服务列表 */}
      <div className="flex flex-col gap-4 bg-[#fafafa] p-2">
        {pack?.serviceList.map((service: any) => (
          <div key={service.serviceId} className="flex gap-2">
            <div className="mb-2 text-sm text-[#acacac]">
              {service.serviceName}
            </div>
            <MediaPreviewGroup fileList={service.fileList as MediaItem[]} />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm">
        <div>
          <div className="text-gray-700">
            <span className="font-medium text-gray-600">
              {t("serviceFee")}：
            </span>
            <span className="text-gray-800">{pack?.totalServiceFee || 0}</span>
          </div>
          <div className="text-sm font-semibold text-orange-500">
            <span className="font-medium text-gray-600">{t("totalFee")}：</span>
            <span>{pack?.totalFee || 0}</span>
          </div>
        </div>
        <div className="mt-3 text-right">
          <div className="text-base font-bold text-[#f0700c]">
            {pack?.status}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        {/* 状态：申请取消 */}
        {pack?.cancelFlag && (
          <button
            className="rounded-lg bg-red-500 px-3 py-1 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-600"
            onClick={onRequestRefund}
          >
            {t("requestRefund")}
          </button>
        )}

        {/* 状态：撤回申请 */}
        {pack?.withdrawFlag && (
          <button
            className="rounded-lg bg-green-500 px-3 py-1 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-600"
            onClick={onRequestWithdraw}
          >
            {t("withdrawRequest")}
          </button>
        )}
        {/* 状态：更换路线 */}
        {pack?.changeFlag && (
          <button
            className="rounded-lg bg-purple-500 px-3 py-1 text-sm font-medium text-white shadow-sm transition-colors hover:bg-purple-600"
            onClick={onRequestChange}
          >
            {t("changeBtn")}
          </button>
        )}
      </div>
    </div>
  );
}
