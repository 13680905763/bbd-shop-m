"use client";

import React, { useState } from "react";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import AddressItem from "./address-item";

import ConfirmModal from "@/components/modal/confirm-modal";
import FormModal from "@/components/modal/form-modal";
import FullscreenLoader from "@/components/common/fullscreen-loader";
import { addAddress, deleteAddress, updateAddress } from "@/services/address";
import { useAddressList } from "@/hook/addresses/useAddressList";
import { FieldConfig } from "@/components/form/formItem-renderer";

type ModalType = "add" | "edit" | "delete" | null;

const initAddress = {
  recipient: "",
  phone: "",
  countryId: "",
  stateId: "",
  city: "",
  addressType: "",
  postcode: "",
  defaultAddress: 0,
  doorNo: "",
};

export default function Cart() {
  const { t } = useTranslation("translation", {
    keyPrefix: "profile.address",
  });
  const { data, isLoading } = useAddressList();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentData, setCurrentData] = useState<any>(initAddress);
  const queryClient = useQueryClient();
  const router = useRouter();

  const fieldsAddress: FieldConfig[] = [
    {
      key: "recipient",
      type: "input",
      name: "recipient",
      label: t("formModal.fields.recipient.label"),
      placeholder: t("formModal.fields.recipient.placeholder"),
      required: true,
    },
    {
      key: "phone",
      type: "input",
      name: "phone",
      label: t("formModal.fields.phone.label"),
      placeholder: t("formModal.fields.phone.placeholder"),
      required: true,
    },
    {
      key: "area",
      type: "area",
      name: "area",
      label: t("formModal.fields.area.label"),
      placeholder: t("formModal.fields.area.placeholder"),
    },
    {
      key: "address",
      type: "input",
      name: "address",
      label: t("formModal.fields.address.label"),
      placeholder: t("formModal.fields.address.placeholder"),
      required: true,
    },
    {
      key: "doorNo",
      type: "input",
      name: "doorNo",
      label: t("formModal.fields.doorNo.label"),
      placeholder: t("formModal.fields.doorNo.placeholder"),
      required: true,
    },
    {
      key: "postcode",
      type: "input",
      name: "postcode",
      label: t("formModal.fields.postcode.label"),
      placeholder: t("formModal.fields.postcode.placeholder"),
      required: true,
    },
    {
      key: "defaultAddress",
      type: "checkbox",
      name: "defaultAddress",
      label: t("formModal.fields.defaultAddress.label"),
    },
  ];

  const handleAdd = () => {
    setCurrentData(initAddress);
    setModalType("add");
  };

  const handleEdit = (row: any) => {
    setCurrentData(row);
    setModalType("edit");
  };

  const handleDelete = (row: any) => {
    setCurrentData(row);
    setModalType("delete");
  };

  const handleSave = async () => {
    const { createTime, updateTime, customerId, ...filteredData } = currentData;

    try {
      if (modalType === "add") {
        await addAddress({
          ...currentData,
          addressType: 1,
          defaultAddress: filteredData.defaultAddress ? 1 : 0,
        });
      } else if (modalType === "edit") {
        await updateAddress({
          ...filteredData,
          defaultAddress: filteredData.defaultAddress ? 1 : 0,
          city: filteredData?.city || filteredData?.state,
        });
      } else if (modalType === "delete") {
        await deleteAddress({ id: currentData.id });
      }
      setModalType(null);
    } finally {
      queryClient.invalidateQueries({ queryKey: ["addressList"] });
    }
  };

  if (isLoading) return <FullscreenLoader />;

  return (
    <>
      <NavBar
        right={<button onClick={handleAdd}>{t("addButton")}</button>}
        onBack={() => router.back()}
      >
        <span className="text-lg font-bold text-gray-900">{t("title")}</span>
      </NavBar>

      <div className="flex-1 space-y-4 bg-[#f5f5f5] p-4">
        {data?.map((addressDetail: any) => (
          <AddressItem
            key={addressDetail.id}
            addressDetail={addressDetail}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        ))}
      </div>

      <FormModal
        fields={fieldsAddress}
        formData={currentData}
        isOpen={modalType === "add" || modalType === "edit"}
        title={
          modalType === "add"
            ? t("formModal.addTitle")
            : t("formModal.editTitle")
        }
        onChange={setCurrentData}
        onOpenChange={(open) => {
          if (!open) setModalType(null);
        }}
        onSave={handleSave}
      />

      <ConfirmModal
        cancelText={t("confirmDelete.cancelText")}
        confirmText={t("confirmDelete.confirmText")}
        content={t("confirmDelete.content")}
        isOpen={modalType === "delete"}
        onConfirm={async () => {
          await handleSave();
        }}
        onOpenChange={(open) => {
          if (!open) setModalType(null);
        }}
      />
    </>
  );
}
