"use client";
import { Card } from "@heroui/react";
import { FiEdit } from "react-icons/fi";

interface BackendAddress {
  id?: string;
  recipient?: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  postcode?: string;
  defaultAddress?: number;
}

interface AddressCardProps {
  data?: BackendAddress;
  onEdit?: (id: string) => void;
  onSelect?: (id: string | null) => void;
  isSelected?: boolean;
  isDisabled?: boolean;
}

export default function AddressCard({
  data,
  onEdit,
  onSelect,
  isSelected,
  isDisabled,
}: AddressCardProps) {
  if (!data) return null;

  const {
    id = "",
    recipient = "未填写收件人",
    phone = "未填写电话",
    country = "",
    state = "",
    city = "",
    address = "",
    postcode = "",
  } = data;

  const fullAddress =
    `${country} ${state} ${city} ${address} ${postcode}`.trim();

  return (
    <Card
      isPressable
      className={`h-24 flex-1 rounded-xl border px-3 py-2 transition ${isSelected ? "border-2 border-primary bg-orange-50" : "border-gray-200"} cursor-pointer active:scale-[0.98]`}
      isDisabled={isDisabled}
      shadow="none"
      onClick={() => {
        if (isDisabled) return; // ✅ 手动阻止
        if (id && isSelected) {
          // onSelect?.(null);
        } else if (id) {
          onSelect?.(id);
        }
      }}
    >
      <div className="flex h-full items-center justify-between">
        {/* 左侧文字 */}
        <div className="flex flex-1 flex-col gap-1 overflow-hidden">
          <span className="line-clamp-1 text-sm font-bold leading-none text-gray-900">
            {recipient}
          </span>

          <span className="text-xs leading-none text-gray-500">{phone}</span>

          <span className="line-clamp-2 text-xs leading-snug text-gray-600">
            {fullAddress}
          </span>
        </div>

        {/* 编辑按钮 */}
        {onEdit && (
          <span
            className="p-2 text-gray-500 hover:text-gray-800"
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              id && onEdit(id);
            }}
          >
            <FiEdit className="h-4 w-4" />
          </span>
        )}
      </div>
    </Card>
  );
}
