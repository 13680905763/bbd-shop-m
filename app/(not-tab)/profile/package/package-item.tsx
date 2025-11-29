import { Button, Checkbox, Image } from "@heroui/react";
import { FiChevronRight, FiSearch } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { ImageViewer } from "antd-mobile";
import { useState } from "react";

import MediaPreviewGroup, {
  MediaItem,
} from "@/components/common/media-preview";
import { useGlobalStore } from "@/store";

export default function PackageItem({
  pack,
  activeTab,
  onChange,
  selected,
  onCancelPackage,
  onRevokePackage,
  onChangePackageLine,
  onPayPackageRedirect,
  onLine,
  onReceiptPackage,
}: any) {
  const t = useTranslations("profile.package");
  const { currency } = useGlobalStore();
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

  console.log("filled", filled);

  return (
    <div className="mb-4 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      {/* 顶部：订单号 + 下单时间 */}
      <div className="flex items-center justify-between border-gray-100">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
          {activeTab === "pay" && (
            <Checkbox
              classNames={{
                base: "p-0 m-0",
                wrapper: "m-0",
              }}
              isSelected={selected}
              onChange={onChange}
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
      <div className="my-3 flex gap-3">
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
              <p>{pack?.shipping?.templateName}</p>
              {/* 物流信息 */}
            </div>
            {pack?.shipping?.shippingCode && (
              <button
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-1 py-0.5 text-sm text-gray-600 hover:text-gray-800"
                onClick={onLine}
              >
                <FiSearch className="text-gray-500" size={16} />

                {/* 文本两行 */}
                <div className="flex flex-col text-sm leading-tight">
                  <span className="text-left text-xs text-gray-500">
                    {t("shippingCode")}
                  </span>
                  <span className="break-all font-medium text-gray-700">
                    {pack.shipping.shippingCode}
                  </span>
                </div>

                <FiChevronRight className="text-gray-400" size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 服务列表 */}
      <div className="flex flex-col gap-2 rounded-lg bg-[#fafafa] p-2">
        {pack?.serviceList.map((service: any) => (
          <div key={service.serviceId} className="flex gap-2">
            <div className="text-sm text-[#acacac]">{service.serviceName}</div>
            <MediaPreviewGroup fileList={service.fileList as MediaItem[]} />
          </div>
        ))}
      </div>

      {/* 金额 + 按钮 */}
      <div className="text-right text-base font-bold text-gray-700">
        <p>
          {t("serviceFee")}
          {currency.symbol}
          {pack?.totalServiceFee}
        </p>
        <p>
          {t("totalFee")}
          {currency.symbol}
          {pack?.totalFee}
        </p>
      </div>

      <div className="flex justify-end gap-1">
        {/* 状态：申请取消 */}
        {pack?.cancelFlag && (
          <Button
            radius="sm"
            size="sm"
            variant="flat"
            onPress={onCancelPackage}
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
            onPress={onRevokePackage}
          >
            {t("buttons.withdraw")}
          </Button>
        )}
        {/* 状态：更换路线 */}
        {pack?.changeFlag && (
          <Button
            color="success"
            radius="sm"
            size="sm"
            variant="flat"
            onPress={onChangePackageLine}
          >
            {t("buttons.change")}
          </Button>
        )}
        {/* 状态：待付款 */}
        {(pack?.statusCode == 203 || pack?.statusCode == 209) && (
          <Button
            color="primary"
            radius="sm"
            size="sm"
            onPress={onPayPackageRedirect}
          >
            {/* {t("changeBtn")} */}
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
            onPress={onReceiptPackage}
          >
            {t("buttons.receipt")}
          </Button>
        )}
      </div>
    </div>
  );
}
