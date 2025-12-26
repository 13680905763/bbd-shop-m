"use client";
import { useEffect, useState } from "react";
import React from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { useTranslation } from "react-i18next";

import FormModal from "@/components/modal/form-modal";
import { addAddress, updateAddress } from "@/services";
import { queryClient } from "@/lib/react-query";
import { FieldConfig } from "@/components/form/formItem-renderer";

type ModalType = "add" | "edit" | null;
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

export default function BillingAddress({ billingAddress }: any) {
  const { t } = useTranslation("translation", {
    keyPrefix: "profile.billingAddress",
  });
  const [modalType, setModalType] = useState<ModalType>(null);
  const [currentData, setCurrentData] = useState<any>(initAddress);
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

  const handleEdit = () => {
    setModalType("edit");
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
      }
      setModalType(null);
    } catch {
    } finally {
      queryClient.invalidateQueries({ queryKey: ["billingAddress"] }); // 手动刷新
    }
  };

  useEffect(() => {
    if (billingAddress?.length) {
      setCurrentData(billingAddress[0]);
    }
  }, [billingAddress]);

  return (
    <>
      {billingAddress?.length ? (
        <div className="relative rounded-xl border-2 border-dashed border-[#5e5e5e] p-4">
          <div className="flex justify-between">
            <div className="flex gap-8">
              <div className="text-title">{currentData?.recipient}</div>
              <div>{currentData?.phone}</div>
            </div>
            <div>{currentData?.postcode}</div>
          </div>
          <div className="text-gray-base mt-2">
            {currentData?.address},{currentData?.city},{currentData?.state},
            {currentData?.country}
          </div>

          {/* 编辑按钮放在右下角 */}
          <button
            className="absolute bottom-2 right-4 flex items-center gap-1 text-sm text-[#f0700c] transition"
            onClick={handleEdit}
          >
            <AiOutlineEdit className="h-4 w-4" />
            <span>{t("edit")}</span>
          </button>
        </div>
      ) : (
        <button
          className="w-full border-2 border-dashed border-[#5e5e5e] p-6"
          onClick={handleAdd}
        >
          <p className="flex items-center justify-center gap-2">
            <span>+</span>
            <span>{t("addButton1")}</span>
          </p>
        </button>
      )}

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
    </>
  );
}
