import type { Address } from "@/types/address";

import { Chip } from "@heroui/react";
import { useTranslations } from "next-intl";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { memo, useCallback } from "react";
import clsx from "clsx";

type AddressItemProps = {
  addressDetail: Address;
  showDeleteButton?: boolean;
  isSelected?: boolean; // 是否被选中（受控）
  onClick?: (address: Address) => void;
  onEdit?: (address: Address) => void;
  onDelete?: (address: Address) => void;
};

export default memo(function AddressItem({
  addressDetail,
  showDeleteButton = true,
  isSelected = false,
  onClick,
  onEdit,
  onDelete,
}: AddressItemProps) {
  const t = useTranslations("components.addressItem");

  const fullCity =
    addressDetail.city === addressDetail.state
      ? `${addressDetail.country} ${addressDetail.state}`
      : `${addressDetail.country} ${addressDetail.state} ${addressDetail.city}`;
  const fullAddress = addressDetail.doorNo
    ? `${addressDetail.address} (${addressDetail.doorNo})`
    : addressDetail.address;

  const handleOnClick = useCallback(() => {
    if (!onClick) return;
    onClick(addressDetail);
  }, [onClick, addressDetail]);
  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      onEdit?.(addressDetail);
    },
    [onEdit, addressDetail],
  );
  const handleDelete = useCallback(() => {
    if (!onDelete) return;
    onDelete(addressDetail);
  }, [onDelete, addressDetail]);

  return (
    <div
      className={clsx(
        "home-card mt-2 flex flex-col gap-1 p-4 text-sm transition",
        isSelected && "bg-primary/5 ring-2 ring-primary",
      )}
      role="button"
      onClick={handleOnClick}
    >
      <div className="flex items-center justify-between font-bold text-gray-900">
        <span className="text-base">{addressDetail.recipient}</span>
        <span className="text-sm font-medium text-gray-600">
          {addressDetail.phone}
        </span>
      </div>

      <div className="text-sm text-gray-500">
        <span className="line-clamp-2">{fullCity}</span>
      </div>
      <div className="text-sm font-medium text-gray-800">
        <span className="line-clamp-2">{fullAddress}</span>
      </div>

      <div className="flex items-center justify-between">
        {addressDetail.defaultAddress ? (
          <Chip color="primary" radius="sm" size="sm">
            {t("default")}
          </Chip>
        ) : (
          <div />
        )}
        <div className="flex gap-1">
          {showDeleteButton && (
            <button
              aria-label={t("delete")}
              className="p-1"
              onClick={handleDelete}
            >
              <FaTrashAlt className="h-5 w-5" />
            </button>
          )}
          <button aria-label={t("edit")} className="p-1" onClick={handleEdit}>
            <FaEdit className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
});
