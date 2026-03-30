import { Button, Checkbox, Image } from "@heroui/react";
import { FiSearch } from "react-icons/fi";
import { FaComments } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { ImageViewer } from "antd-mobile";
import { useState } from "react";

import MediaPreviewGroup, {
  MediaItem,
} from "@/components/common/media-preview";
import { useGlobalStore, useChatStore } from "@/store";

export default function PackageItem({
  pack,
  showCheckbox,
  onSelect,
  isSelected,
  onCancel,
  onRevoke,
  onPay,
  onTrack,
  onReceipt,
  onEdit,
}: any) {
  const t = useTranslations("profile.package");
  const { currency } = useGlobalStore();
  const { setPendingWaybill, setIsOpen } = useChatStore();
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [isTrackLoading, setIsTrackLoading] = useState(false);
  const [isPayLoading, setIsPayLoading] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const [visible, setVisible] = useState(false);
  const items = pack.packageItemList;
  const len = items.length;

  // 最小的 n，使得 n² >= len
  const n = Math.ceil(Math.sqrt(len));

  // 总格子数
  const totalCells = n * n;

  // 填充空位
  const filled = [...items, ...Array(totalCells - len).fill(null)];
  const ImageList = items?.map((item: any) => {
    return item.orderProduct?.skuPicUrl || item.orderProduct?.picUrl;
  });

  // console.log("filled", filled);

  return (
    <div className="space-y-2 rounded-xl bg-white p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
          {showCheckbox && (
            <Checkbox
              classNames={{
                base: "p-0 m-0",
                wrapper: "m-0",
              }}
              isSelected={isSelected(pack?.packingPackageCode)}
              onChange={() => onSelect(pack?.packingPackageCode)}
            />
          )}
          <div className="font-semibold">
            {pack?.packingPackageCode}
            <div className="text-xs text-gray-500">{pack?.createTime}</div>
          </div>
        </div>
        <div className="self-start text-right text-sm font-bold text-[#f0700c]">
          {pack?.status}
        </div>
      </div>
      {/* 包裹商品列表 */}
      <div className="flex gap-3">
        <div
          className={`grid h-[120px] w-[120px] gap-1`}
          role="button"
          style={{
            gridTemplateColumns: `repeat(${n}, 1fr)`,
            gridTemplateRows: `repeat(${n}, 1fr)`,
          }}
        >
          {filled.map((item, index) =>
            item ? (
              <Image
                key={item.id}
                alt="product"
                className="h-full w-full rounded-sm object-cover"
                radius="none"
                referrerPolicy="no-referrer"
                src={item.orderProduct?.skuPicUrl || item.orderProduct?.picUrl}
                onClick={() => {
                  setStartIndex(index); // 点击哪张图片就从哪张开始预览
                  setVisible(true);
                }}
              />
            ) : (
              // 空占位格子
              <div key={index} />
            ),
          )}
          <ImageViewer.Multi
            key={startIndex} // ★ 让组件强制重新创建
            defaultIndex={startIndex} // 从点击的那张开始
            images={ImageList}
            visible={visible}
            onClose={() => setVisible(false)}
          />
        </div>

        {/* 商品信息 */}
        <div className="flex-1">
          {/* 重量 & 尺寸 */}
          <div className="flex flex-col">
            <div className="text-sm font-semibold">
              {t("weight")}
              <span>{pack?.weight} g</span>
            </div>
            <div className="text-sm text-gray-600">
              {t("size")}
              {pack?.length} × {pack?.width} × {pack?.height} cm
            </div>
            <div className="flex flex-col text-sm text-gray-600">
              <p>{pack?.shipping?.methodCode}</p>
              <p>{pack?.shipping?.templateName}</p>
              {pack?.shipping?.shippingCode && (
                <Button
                  className="border border-[#f0700c] bg-[#fff] text-[#f0700c]"
                  isLoading={isTrackLoading}
                  size="sm"
                  onPress={async () => {
                    setIsTrackLoading(true);
                    await onTrack(pack);
                    setIsTrackLoading(false);
                  }}
                >
                  <FiSearch size={14} />
                  {pack.shipping.shippingCode}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* 服务列表 */}
      {pack?.serviceList?.length > 0 && (
        <div className="flex flex-col gap-2 rounded-lg bg-[#fafafa] p-2">
          {pack?.serviceList.map((service: any) => (
            <div key={service.serviceId} className="flex gap-2">
              <div className="text-sm text-[#acacac]">
                {service.serviceName}
              </div>
              <MediaPreviewGroup fileList={service.fileList as MediaItem[]} />
            </div>
          ))}
        </div>
      )}
      {/* 购买保险提示 */}
      {!!pack?.insurance && (
        <div className="flex items-center gap-1 rounded bg-orange-50 px-2 py-1 text-xs text-orange-500">
          {t("hasInsurance")}
        </div>
      )}
      {/* 金额 + 按钮 */}
      <div className="text-right text-sm font-bold text-gray-700">
        <p>
          {t("serviceFee")}
          {currency.symbol}
          {pack?.totalServiceFee || 0}
        </p>
        {!!pack?.insurance && (
          <p>
            {t("insuranceFee")}
            {currency.symbol}
            {pack?.insuranceFee || 0}
          </p>
        )}
        <p>
          {t("totalFee")}
          {currency.symbol}
          {pack?.totalFee}
        </p>
      </div>
      <div className="flex justify-between items-center mt-2">
        <div>
          <Button
            color="primary"
            size="sm"
            variant="light"
            onPress={() => {
              const pic = pack?.packageItemList?.map((item: any) => item.orderProduct?.skuPicUrl || item.orderProduct?.picUrl).filter(Boolean);
              setPendingWaybill({ ...pack, pic });
              setIsOpen(true);
            }}
          >
            <FaComments className="h-5 w-5" />
            {t("buttons.consult") || "Consult"}
          </Button>
        </div>
        <div className="flex justify-end gap-1">
          {(pack?.changeFlag || pack?.addressFlag) && (
          <Button
            className="button-default"
            radius="sm"
            size="sm"
            onPress={() => onEdit(pack)}
          >
            {t("buttons.edit")}
          </Button>
        )}
        {pack?.cancelFlag && (
          <Button
            isLoading={isCancelLoading}
            radius="sm"
            size="sm"
            variant="flat"
            onPress={async () => {
              setIsCancelLoading(true);
              await onCancel(pack);
              setIsCancelLoading(false);
            }}
          >
            {t("buttons.cancel")}
          </Button>
        )}
        {/* 状态：撤回申请 */}
        {pack?.withdrawFlag && (
          <Button
            color="danger"
            radius="sm"
            size="sm"
            variant="flat"
            onPress={() => onRevoke(pack?.id)}
          >
            {t("buttons.withdraw")}
          </Button>
        )}
        {/* 状态：待付款 */}
        {(pack?.statusCode == 203 || pack?.statusCode == 209) && (
          <Button
            color="primary"
            isLoading={isPayLoading}
            radius="sm"
            size="sm"
            onPress={async () => {
              setIsPayLoading(true);
              await onPay([pack?.packingPackageCode]);
              setIsPayLoading(false);
            }}
          >
            {pack?.statusCode == 203
              ? t("buttons.pay")
              : t("buttons.payCancel")}
          </Button>
        )}
        {/* 状态：确认签收 */}
        {pack?.signFlag && (
          <Button
            color="primary"
            radius="sm"
            size="sm"
            onPress={() => onReceipt(pack?.id)}
          >
            {t("buttons.receipt")}
          </Button>
        )}
        </div>
      </div>
    </div>
  );
}
