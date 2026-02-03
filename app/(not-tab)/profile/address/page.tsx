"use client";

import React, { useCallback, useState } from "react";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Address, AddressModalState } from "@/types";
import ConfirmModal from "@/components/confirm-modal";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import { deleteAddress } from "@/services/address";
import { useAddressList } from "@/hook/api";
import AddressModal from "@/components/modal/address-modal";
import AddressItem from "@/components/block/address-item";

export default function AddressPage() {
  const t = useTranslations("profile.address"); // 绑定 JSON 路径
  const { data: addressList, isLoading } = useAddressList();

  const [modalState, setModalState] = useState<AddressModalState>({
    type: null,
  });
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) setModalState({ type: null });
  }, []);

  const handleAddClick = useCallback(() => {
    setModalState({ type: "add" });
  }, []);
  const handleEditClick = useCallback((address: Address) => {
    setModalState({ type: "edit", address });
  }, []);
  const handleDeleteClick = useCallback((address: Address) => {
    setModalState({ type: "delete", address });
  }, []);

  const handleDeleteSubmit = useCallback(async () => {
    if (modalState.type !== "delete") return;
    try {
      await deleteAddress({ id: modalState.address.id });
      queryClient.invalidateQueries({ queryKey: ["addressList"] });
    } catch (error) {
      console.error("删除地址失败:", error);
    }
  }, [modalState, queryClient]);

  if (isLoading) return <FullscreenLoader />;

  return (
    <>
      <NavBar
        className="bg-white"
        right={<button onClick={handleAddClick}>{t("addButton")}</button>}
        onBack={() => router.back()}
      >
        <span className="navbar-title">{t("title")}</span>
      </NavBar>

      <div className="flex-1 overflow-auto px-3">
        {addressList?.map((addressDetail: Address) => (
          <AddressItem
            key={addressDetail.id}
            addressDetail={addressDetail}
            onDelete={handleDeleteClick}
            onEdit={handleEditClick}
          />
        ))}
      </div>

      <AddressModal
        defaultData={
          modalState.type === "edit" ? modalState.address : undefined
        }
        isOpen={modalState.type === "add" || modalState.type === "edit"}
        type={modalState.type === "add" ? "add" : "edit"}
        onOpenChange={handleOpenChange}
      />

      <ConfirmModal
        content={t("deleteContent")}
        isOpen={modalState.type === "delete"}
        onConfirm={handleDeleteSubmit}
        onOpenChange={handleOpenChange}
      />
    </>
  );
}
