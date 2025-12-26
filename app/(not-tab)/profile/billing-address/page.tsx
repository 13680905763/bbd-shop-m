"use client";
import React, { useState } from "react";

// import ShopCard from "./shop-card";

import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import AddressItem from "./address-item";

import ConfirmModal from "@/components/modal/confirm-modal";
import FormModal from "@/components/modal/form-modal";
import { addAddress, deleteAddress, updateAddress } from "@/services/address";
import { FieldConfig } from "@/components/form/formItem-renderer";
import { useBillingAddressList } from "@/hook";
import FullscreenLoader from "@/components/common/fullscreen-loader";

type ModalType = "add" | "edit" | "delete" | null;
const initAddress = {
  familyName: "",
  givenName: "",
  phone: "",
  countryId: "",
  stateId: "",
  city: "",
  addressType: "",
  postcode: "",
  doorNo: "",
};

export default function BillingAddress() {
  const { t } = useTranslation("translation", {
    keyPrefix: "profile.billingAddress",
  });

  const { data, isLoading } = useBillingAddressList();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentData, setCurrentData] = useState<any>(initAddress);
  const queryClient = useQueryClient();
  const router = useRouter();

  const fieldsAddress: FieldConfig[] = [
    {
      type: "input",
      name: "familyName",
      label: t("formModal.fields.familyName.label"),
      placeholder: t("formModal.fields.familyName.placeholder"),
      required: true,
      key: "familyName",
    },
    {
      type: "input",
      name: "givenName",
      label: t("formModal.fields.givenName.label"),
      placeholder: t("formModal.fields.givenName.placeholder"),
      required: true,
      key: "givenName",
    },
    {
      type: "input",
      name: "phone",
      label: t("formModal.fields.phone.label"),
      placeholder: t("formModal.fields.phone.placeholder"),
      required: true,
      key: "phone",
    },
    {
      type: "area",
      name: "area",
      label: t("formModal.fields.area.label"),
      placeholder: t("formModal.fields.area.placeholder"),
      key: "area",
    },
    {
      type: "input",
      name: "address",
      label: t("formModal.fields.address.label"),
      placeholder: t("formModal.fields.address.placeholder"),
      required: true,
      key: "address",
    },
    {
      type: "input",
      name: "doorNo",
      label: t("formModal.fields.doorNo.label"),
      placeholder: t("formModal.fields.doorNo.placeholder"),
      required: true,
      key: "doorNo",
    },
    {
      type: "input",
      name: "postcode",
      label: t("formModal.fields.postcode.label"),
      placeholder: t("formModal.fields.postcode.placeholder"),
      required: true,
      key: "postcode",
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
  // 地址保存时处理
  const handleSave = async () => {
    const { createTime, updateTime, customerId, ...filteredData } = currentData;

    try {
      if (modalType === "add") {
        await addAddress({
          ...currentData,
          addressType: 2,
          defaultAddress: 1,
        }); // 新增接口
      } else if (modalType === "edit") {
        await updateAddress({
          ...filteredData,
          city: filteredData?.city || filteredData?.state,
        }); // 编辑接口
      } else if (modalType === "delete") {
        await deleteAddress({ id: currentData.id });
      }
      setModalType(null);
    } catch {
    } finally {
      queryClient.invalidateQueries({ queryKey: ["billingAddress"] }); // 手动刷新
    }
  };

  {
    isLoading && <FullscreenLoader />;
  }

  return (
    <>
      <NavBar
        right={
          data?.length === 0 ? (
            <button onClick={handleAdd}>{t("addButton")}</button>
          ) : null
        }
        onBack={() => router.back()}
      >
        <span className="text-lg font-bold text-gray-900">{t("title")}</span>
      </NavBar>

      <div className="flex-1 bg-[#f5f5f5] p-4">
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
