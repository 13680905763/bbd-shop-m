"use client";
import React, { useState } from "react";
import { Accordion, AccordionItem } from "@heroui/react";
import { useTranslations } from "next-intl";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";

import { useCountries, useCategoryOptions, useLineEstimate } from "@/hook/api";
import { useGlobalStore } from "@/store";
import { FieldConfig } from "@/components/form/formItem-renderer";
import CommonForm from "@/components/form/common-form";
import { EmptyState } from "@/components/ui";
import { LineItem } from "@/components/item-list";

export default function Estimation() {
  const t = useTranslations("estimation");
  const { currency } = useGlobalStore();
  const { data: countries = [], isLoading: isCountriesLoading } =
    useCountries();
  const { data: categoryOptions = [], isLoading: isCategoryLoading } =
    useCategoryOptions();

  const [searchParams, setSearchParams] = useState<any>(null);
  const { data: lineEstimate = [], isFetching: isSearching } =
    useLineEstimate(searchParams);

  const routes = Array.isArray(lineEstimate) ? lineEstimate : [];
  const routesMessage = typeof lineEstimate === "string" ? lineEstimate : "";

  const router = useRouter();

  // ✅ 受控表单数据
  const [formData, setFormData] = useState({
    countryId: 0, // 改成 number 类型
    categoryId: "", // 改成 number 类型
    weight: "",
    length: "",
    width: "",
    height: "",
  });

  const fields: FieldConfig[] = [
    {
      type: "autocomplete",
      name: "countryId",
      label: t("warehouse"),
      options: countries,
      required: true,
      errorMessage: t("selectCountry"),
      isDisabled: isCountriesLoading,
      config: {
        labelKey: "name",
        valueKey: "id",
        imageKey: "nationalFlag",
      },
    },
    {
      type: "autocomplete",
      name: "categoryId",
      label: t("category"),
      options: categoryOptions,
      required: true,
      errorMessage: t("selectCategory"),
      isDisabled: isCategoryLoading,
      config: {
        labelKey: "categoryName",
        valueKey: "id",
      },
    },
    {
      type: "dimensions",
      name: "dimensions",
      required: true,
      errorMessage: t("fillWeightOrSize"),
      labels: {
        weight: t("weight"),
        length: t("length"),
        width: t("width"),
        height: t("height"),
      },
    },
  ];

  const onSubmit = async (data: typeof formData) => {
    setSearchParams(data);
  };

  const disabledKeys = routes
    .map((route, index) => (route.disable ? String(index) : null))
    .filter((item) => item !== null) as string[];

  return (
    <>
      <NavBar className="bg-white" onBack={() => router.push("/")}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>
      <div className="flex-1 overflow-auto scrollbar-hide">
        <div className="bg-[url('/m/images/estimation/bg.webp')] bg-center pt-[30%]" />
        <div className="bg-white p-5">
          <CommonForm
            confirmText={t("search")}
            fields={fields}
            formData={formData}
            isLoading={isSearching}
            onChange={setFormData}
            onSubmit={onSubmit}
          />
          {routes.length > 0 && (
            <Accordion
              className="!border-1"
              disabledKeys={disabledKeys}
              variant="bordered"
            >
              {routes.map((route, index) => (
                <AccordionItem key={index} title={<LineItem line={route} />}>
                  <div className="flex flex-col gap-3 pb-3">
                    <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
                      <p className="mb-2 text-sm font-semibold">
                        {t("pricingStandard")}({route.firstWeight}g)
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-gray-500">
                            {t("firstWeightFee")}
                          </span>
                          <span className="font-semibold text-gray-800">
                            {currency.symbol}
                            {route.firstWeightFee}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-gray-500">
                            {t("additionalWeightFee")}
                          </span>
                          <span className="font-semibold text-gray-800">
                            {currency.symbol}
                            {route.additionalWeightFee}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
                      <p className="text-sm font-semibold">
                        {t("shippingLimit")}
                      </p>
                      <div className="inline-flex items-center rounded-md border border-gray-200 px-3 py-2">
                        <span className="text-base font-semibold text-gray-800">
                          {route.shippingLine.minWeight} -{" "}
                          {route.shippingLine.maxWeight}
                        </span>
                        <span className="ml-1 text-xs text-gray-500">g</span>
                      </div>
                      <p className="mt-2 text-sm font-semibold">
                        {t("routeFeature")}
                      </p>
                      <div className="line-clamp-5 rounded-md bg-gray-50 p-3 text-xs leading-snug text-gray-700">
                        {route.shippingLine.description}
                      </div>
                    </div>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          )}
          {routes?.length < 1 && routesMessage && (
            <EmptyState className="!h-auto" desc={routesMessage} />
          )}
        </div>
      </div>
    </>
  );
}
