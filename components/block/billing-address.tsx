import type { Address } from "@/types/address";

import { Divider } from "@heroui/react";
import { useTranslations } from "next-intl";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { memo, useCallback } from "react";

type AddressItemProps = {
  addressDetail: Address | any;
  showDeleteButton?: boolean;
  onEdit: (address: Address) => void;
  onDelete?: (address: Address) => void;
  onAdd?: () => void;
};

export default memo(function BillingAddress({
  addressDetail,
  showDeleteButton = true,
  onEdit,
  onDelete,
  onAdd: handleAdd,
}: AddressItemProps) {
  console.log("渲染账单地址~~~");
  const t = useTranslations("components.billingAddress");

  if (!addressDetail || Object.keys(addressDetail).length === 0) {
    return (
      <button
        className="w-full rounded-lg border-2 border-dashed border-[#5e5e5e] p-6"
        onClick={handleAdd}
      >
        <p className="flex items-center justify-center gap-2">
          <span className="text-2xl font-bold">+</span>
        </p>
      </button>
    );
  }

  const fullCity =
    addressDetail.city === addressDetail.state
      ? `${addressDetail.country} ${addressDetail.state}`
      : `${addressDetail.country} ${addressDetail.state} ${addressDetail.city}`;
  const fullAddress = addressDetail.doorNo
    ? `${addressDetail.address} (${addressDetail.doorNo})`
    : addressDetail.address;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      onEdit(addressDetail);
    },
    [onEdit, addressDetail],
  );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleDelete = useCallback(() => {
    if (!onDelete) return;
    onDelete(addressDetail);
  }, [onDelete, addressDetail]);

  return (
    <div className="home-card mt-2 flex flex-col gap-1 border-2 border-dashed border-[#5e5e5e] p-4 text-sm transition">
      <div className="flex items-center justify-between font-semibold text-gray-800">
        <span>{addressDetail.recipient}</span>
        <span className="text-gray-600">{addressDetail.phone}</span>
      </div>

      <div className="text-gray-700">
        <span className="line-clamp-2">{fullCity}</span>
      </div>
      <div className="text-gray-700">
        <span className="line-clamp-2">{fullAddress}</span>
      </div>

      <Divider className="my-1" />

      <div className="flex items-center justify-between">
        <div />
        <div className="flex gap-1">
          {showDeleteButton && (
            <button
              aria-label={t("delete")}
              className="p-2"
              onClick={handleDelete}
            >
              <FaTrashAlt className="h-4 w-4" />
            </button>
          )}
          <button aria-label={t("edit")} className="p-2" onClick={handleEdit}>
            <FaEdit className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
});
