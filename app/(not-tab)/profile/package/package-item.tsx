import { Checkbox, Image } from "@heroui/react";

import MediaPreviewGroup, {
  MediaItem,
} from "@/components/common/media-preview";

export default function PackageItem({
  pack,

  activeTab,
  onChange,
  selected,
}: any) {
  return (
    <div className="mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* 顶部：订单号 + 下单时间 */}
      <div className="flex items-center justify-between pb-2">
        {activeTab === "pay" ? (
          <Checkbox isSelected={selected} onChange={onChange} />
        ) : null}
        <div className="text-sm font-medium text-gray-800">
          包裹编号：
          <span className="font-semibold">{pack?.packingPackageCode}</span>
        </div>
        <div className="text-xs text-gray-500">{pack?.createTime}</div>
      </div>

      <div className="flex gap-4">
        {/* 左侧图片区域，宽度50%，可横向滚动 */}
        <div className="flex w-1/2 gap-2 overflow-x-auto">
          {pack.packageItemList.map((item: any) => (
            <div key={item.id} className="flex-shrink-0">
              <Image
                alt="商品图"
                className="h-full w-full rounded-lg object-cover shadow-sm"
                classNames={{ wrapper: "self-start" }}
                height={110}
                src={
                  item?.orderProduct?.skuPicUrl || item?.orderProduct?.picUrl
                }
                width={96}
              />
            </div>
          ))}
        </div>

        {/* 右侧信息区域，宽度50% */}
        <div className="flex w-1/2 flex-col justify-start gap-1 text-sm">
          {/* 尺寸 */}
          <div className="text-gray-700">
            <span className="font-medium text-gray-600">尺寸: </span>
            <span className="text-gray-800">
              {pack?.length} × {pack?.width} × {pack?.height} cm
            </span>
          </div>

          {/* 重量 */}
          <div className="text-gray-700">
            <span className="font-medium text-gray-600">重量: </span>
            <span className="text-gray-800">{pack?.weight} g</span>
          </div>

          {/* 物流方式 */}
          <div className="text-gray-700">
            <span className="font-medium text-gray-600">物流方式: </span>
            <span className="text-gray-800">
              {pack?.shipping?.methodCode || "暂无"}
            </span>
          </div>

          {/* 服务费 */}
          <div className="text-gray-500">
            <span className="font-medium text-gray-600">服务费: </span>
            <span className="text-gray-800">{pack?.totalServiceFee || 0}</span>
          </div>

          {/* 总费用 */}
          <div className="text-sm font-semibold text-orange-500">
            <span className="font-medium text-gray-600">总费用: </span>
            <span>{pack?.totalFee || 0}</span>
          </div>
        </div>
      </div>

      {/* 服务列表 */}
      <div className="mt-3 flex flex-col gap-4 bg-[#fafafa] p-2">
        {pack.serviceList.map((service: any) => (
          <div key={service.serviceId} className="flex gap-2">
            <div className="mb-2 text-sm text-[#acacac]">
              {service.serviceName}
            </div>
            <MediaPreviewGroup fileList={service.fileList as MediaItem[]} />
          </div>
        ))}
      </div>
      {/* 金额 + 按钮 */}
      <div className="mt-3 text-right">
        {/* <p className="my-2 text-sm text-gray-700">
          <span className="text-lg font-bold text-[#f0700c]">
            {warehouse?.status}
          </span>
        </p> */}
        <div className="text-base font-bold text-[#f0700c]">{pack?.status}</div>
        {/* {pack?.status === "待付款" ? (
          <div className="space-x-2">
            <Button
              color="primary"
              radius="sm"
              size="sm"
              onPress={() => {
                // onPayOrderRedirect(warehouse?.orderCode);
              }}
            >
              支付
            </Button>
            <Button
              radius="sm"
              size="sm"
              variant="flat"
              onPress={() => {
                // onCancelOrder(warehouse?.id);
              }}
            >
              取消
            </Button>
          </div>
        ) : (
          <div className="text-base font-bold text-[#f0700c]">
            {pack?.status}
          </div>
        )} */}
      </div>
    </div>
  );
}
