"use client";
import { Button, Checkbox, useDisclosure } from "@heroui/react";
import React, { useState } from "react";
import { useTranslations } from "next-intl";

// import ShopCard from "./shop-card";

import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";

export default function Favorite() {
  const t = useTranslations("favorite");
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selected, setSelected] = useState<{
    [shopId: string]: { [productId: string]: boolean };
  }>({});

  return (
    <div className="flex h-[calc(var(--vh)_*_100)] flex-col justify-between overflow-hidden">
      <NavBar
        className="bg-white"
        right={
          <button onClick={() => setIsEdit(!isEdit)}>
            {isEdit ? t("cancel") : t("manage")}
          </button>
        }
        onBack={() => router.back()}
      >
        {t("title")}
      </NavBar>

      <div className="flex-1 overflow-auto px-3">
        {/* {a.map((product: Product) => (
          <ProductItem key={product.id} product={product} />
        ))} */}
      </div>
      {isEdit ? (
        <div className="flex items-center justify-between border-b border-[#f5f5f5] bg-white px-3 py-2">
          <div>
            <Checkbox>{t("selectAll")}</Checkbox>
          </div>
          <div className="flex items-center gap-2">
            <Button color="primary">{t("delete")}</Button>
          </div>
        </div>
      ) : null}

      {/* 
      <ConfirmModal
        content={t("deleteConfirmContent")}
        isOpen={isOpen}
        title={t("deleteConfirmTitle")}
        onOpenChange={onOpenChange}
      /> */}
    </div>
  );
}
