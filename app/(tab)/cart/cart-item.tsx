"use client";
import { Checkbox, Image, Input } from "@heroui/react";
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useGlobalStore } from "@/store";
import Stepper from "@/components/stepper";
import SourceIcon from "@/components/common/source-icon";

function ProductItem({
  product,
  isSelected,
  toggle,
  handleProductQuantity,
  openRemarkModal,
}: any) {
  const { t } = useTranslation("translation", { keyPrefix: "cart" });

  const { currency } = useGlobalStore();
  const router = useRouter();

  return (
    <>
      <div className="my-3 flex items-center gap-2">
        <Checkbox
          className="m-0 p-0"
          classNames={{ wrapper: "p-0 m-0" }}
          isSelected={isSelected}
          size="sm"
          onChange={toggle}
        />
        <button
          onClick={() =>
            router.push(
              `/goods?source=${product.source}&sourceProductId=${product.sourceProductId}`,
            )
          }
        >
          <Image
            alt="商品图"
            className="rounded-md object-cover"
            classNames={{ wrapper: "self-start" }}
            height={93}
            referrerPolicy="no-referrer"
            src={product.skuPicUrl || product?.picUrl}
            width={93}
          />
        </button>
        <div className="flex-1">
          <div className="text-title line-clamp-1">{product.productTitle}</div>
          <div className="text-light-gray line-clamp-2">
            {product.sku.propName_valueName}
          </div>

          <div className="mt-5 flex items-center justify-between gap-2">
            <div className="flex flex-1 flex-col">
              <span className="text-price-base">
                {currency.symbol}
                {product?.unitPrice}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Stepper
                value={product.quantity}
                onChange={(quantity) =>
                  handleProductQuantity(product.id, quantity)
                }
              />
            </div>
          </div>
        </div>
      </div>
      <Input
        isReadOnly
        classNames={{ inputWrapper: "bg-[#f8f8f8]", input: "!text-[#333]" }}
        endContent={
          <button onClick={() => openRemarkModal(product.id, product.remark)}>
            <FaEdit className="h-6 w-6" />
          </button>
        }
        placeholder={t("remark.placeholder")}
        size="sm"
        value={product.remark}
      />
    </>
  );
}

export default function ShopCard({
  shop,
  handleProductDelete,
  handleProductQuantity,
  handleProductRemark,
  isGroupAllSelected,
  toggleGroup,
  isSelected,
  toggle,
  openRemarkModal,
}: any) {
  return (
    <div className="rounded-box mb-3 px-2 py-3">
      <div className="flex items-center gap-2">
        <Checkbox
          className="m-0 p-0"
          classNames={{ wrapper: "p-0 m-0" }}
          isSelected={isGroupAllSelected}
          size="sm"
          onChange={toggleGroup}
        />
        <SourceIcon source={shop.cartList[0]?.source} />
        <div className="text-title">{shop?.shopName}</div>
      </div>

      {shop.cartList.map((p: any) => (
        <ProductItem
          key={p.id}
          handleProductDelete={handleProductDelete}
          handleProductQuantity={handleProductQuantity}
          handleProductRemark={handleProductRemark}
          isSelected={isSelected(p.id)}
          openRemarkModal={openRemarkModal}
          product={p}
          toggle={() => toggle(p.id)}
        />
      ))}
    </div>
  );
}
