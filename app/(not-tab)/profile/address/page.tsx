"use client";

import React, { useCallback, useState } from "react";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Address, AddressModalState } from "@/types";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import { useAddressList, useDeleteAddress } from "@/hook/api";
import { AddressItem } from "@/components/list-item";
import { useConfirm } from "@/hook/common";
import { EditAddressDrawer } from "@/components/drawer";

export default function AddressPage() {
  const t = useTranslations("profile.address");
  const { data: addressList, isLoading } = useAddressList();
  const { mutateAsync: deleteAddressMutate } = useDeleteAddress();
  const { confirm } = useConfirm();

  const [modalState, setModalState] = useState<AddressModalState>({
    type: null,
  });
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
  const handleDeleteClick = useCallback(
    async (address: Address) => {
      await confirm({
        content: t("deleteContent"),
        onConfirm: async () => {
          await deleteAddressMutate({ id: address.id });
        },
      });
    },
    [confirm, deleteAddressMutate],
  );

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
      <div className="flex-1 overflow-auto p-2 scrollbar-hide">
        {addressList?.map((addressDetail: Address) => (
          <AddressItem
            key={addressDetail.id}
            addressDetail={addressDetail}
            onDelete={handleDeleteClick}
            onEdit={handleEditClick}
          />
        ))}
      </div>
      {/* <AddressModal
        defaultData={
          modalState.type === "edit" ? modalState.address : undefined
        }
        isOpen={modalState.type === "add" || modalState.type === "edit"}
        type={modalState.type === "add" ? "add" : "edit"}
        onOpenChange={handleOpenChange}
      /> */}
      <EditAddressDrawer
        defaultData={
          modalState.type === "edit" ? modalState.address : undefined
        }
        isOpen={modalState.type === "add" || modalState.type === "edit"}
        type={modalState.type === "add" ? "add" : "edit"}
        onOpenChange={handleOpenChange}
      />
    </>
  );
}
