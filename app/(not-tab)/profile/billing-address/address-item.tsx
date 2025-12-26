import { Divider } from "@heroui/react";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

type AddressItemProps = {
  addressDetail: any;
  handleDelete: any;
  handleEdit: any;
};

export default function AddressItem({
  addressDetail,
  handleDelete,
  handleEdit,
}: AddressItemProps) {
  return (
    <div className="my-3 flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 text-[15px] shadow-sm">
      {/* 收件人 + 电话 */}
      <div className="flex items-center justify-between text-[16px] font-semibold text-gray-800">
        <span>{addressDetail.recipient}</span>
        <span className="text-[15px] text-gray-600">{addressDetail.phone}</span>
      </div>

      {/* 地址 + 门牌号 */}
      <div className="text-[14px] leading-relaxed text-gray-700">
        <span className="line-clamp-2">
          {addressDetail.address}
          {addressDetail.doorNo && (
            <span className="ml-1 text-gray-500">
              （{addressDetail.doorNo}）
            </span>
          )}
        </span>
      </div>

      <Divider className="my-2" />

      {/* 底部操作栏 */}
      <div className="flex items-center justify-between text-[13px]">
        <div className="w-1" />

        <div className="flex gap-3">
          <button
            className="flex h-6 w-6 items-center justify-center text-gray-500 transition-colors hover:text-red-500"
            title="删除地址"
            onClick={() => handleDelete(addressDetail)}
          >
            <FaTrashAlt className="h-4 w-4" />
          </button>
          <button
            className="flex h-6 w-6 items-center justify-center text-gray-500 transition-colors hover:text-blue-500"
            title="编辑地址"
            onClick={() => handleEdit(addressDetail)}
          >
            <FaEdit className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
