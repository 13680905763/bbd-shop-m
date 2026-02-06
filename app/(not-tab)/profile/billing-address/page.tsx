"use client";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import FullscreenLoader from "@/components/common/fullscreen-loader";
import BillingAddressModal from "@/components/modal/billing-address-modal";
import { useBillingAddressActions } from "@/hook/business";
import { useBillingAddress } from "@/hook/api";

import BillingAddress from "@/components/block/billing-address";

export default function BillingAddressPage() {
  const t = useTranslations("profile.billingAddress");
  const { data, isLoading } = useBillingAddress();
  const router = useRouter();

  const {
    modalState,
    handleOpenChange,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
  } = useBillingAddressActions();

  if (isLoading) return <FullscreenLoader />;

  return (
    <>
      <NavBar className="bg-white" onBack={() => router.back()}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>

      <div className="flex-1 overflow-auto px-3 py-2">
        <BillingAddress
          key={data.id}
          addressDetail={data}
          onAdd={handleAddClick}
          onDelete={handleDeleteClick}
          onEdit={handleEditClick}
        />
      </div>
      <BillingAddressModal
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
