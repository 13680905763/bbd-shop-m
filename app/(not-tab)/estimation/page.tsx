"use client";
import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Form,
  Button,
  Input,
  Spacer,
  Accordion,
  AccordionItem,
  addToast,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";

import { getCategory, searchWarehouseRoutesList } from "@/services";
import { useCountries } from "@/hook";
import { useGlobalStore } from "@/store";
import FullscreenLoader from "@/components/common/fullscreen-loader";

export default function Estimation() {
  const t = useTranslations("estimation");
  const { currency } = useGlobalStore();
  const [loading, setLoading] = useState(false);
  const { data: countries = [], isLoading } = useCountries();
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
  const [routesMessage, setRoutesMessage] = useState<string>("");

  const [routes, setRoutes] = useState<any[]>([]);
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

  /** 货物类别 */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: any = await getCategory();

        setCategoryOptions(res);
      } catch {}
    };

    fetchData();
  }, []);
  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { countryId, categoryId, weight, length, width, height } = formData;

    // 校验国家和分类
    if (!countryId) {
      addToast({
        title: t("selectCountry"),
        timeout: 1000,
        color: "danger",
      });

      return;
    }

    if (!categoryId) {
      addToast({
        title: t("selectCategory"),
        timeout: 1000,
        color: "danger",
      });

      return;
    }
    // 校验逻辑
    const isWeightFilled = weight && Number(weight) > 0;
    const isSizeFilled =
      length &&
      Number(length) > 0 &&
      width &&
      Number(width) > 0 &&
      height &&
      Number(height) > 0;

    if (!isWeightFilled && !isSizeFilled) {
      addToast({
        title: t("fillWeightOrSize"),
        timeout: 1000,
        color: "danger",
      });

      return;
    }

    console.log("formData", formData);
    setLoading(true); // 开始请求，显示 loading
    try {
      const res = await searchWarehouseRoutesList(formData);

      if (typeof res != "string" && res?.length) {
        setRoutes(res || []);
      } else {
        setRoutes([]);
        setRoutesMessage(res);
      }
    } catch {
    } finally {
      setLoading(false); // 请求结束，隐藏 loading
    }
  };

  const disabledKeys = routes
    .map((route, index) => (route.disable ? String(index) : null))
    .filter((item) => item !== null) as string[];
  const ShippingRouteCard = ({ route }: any) => {
    return (
      <>
        <div className="flex w-full gap-2">
          {/* 左侧 */}
          <div className="flex w-[90px] flex-shrink-0 flex-col items-center gap-1">
            <Avatar
              className="h-20 w-20 flex-shrink-0 rounded-sm"
              radius="none"
              src={route.logoUrl}
            />
            <p className="line-clamp-2 text-center text-sm font-semibold leading-tight text-gray-900">
              {route.templateName}
            </p>
            <p className="text-center text-sm font-bold leading-snug text-orange-500">
              {currency.symbol}
              {route.shippingFee}
            </p>
            <p className="text-center text-xs leading-snug text-gray-500">
              {route.shippingLine.minDays}-{route.shippingLine.maxDays} day
            </p>
          </div>

          {/* 右侧描述 */}
          <div className="line-clamp-5 flex-1 rounded-md bg-gray-50 p-2 text-sm text-gray-600">
            {route.shippingLine.description}
          </div>
        </div>
        {route.disable && route.prompt && (
          <div className="mt-2 rounded-lg bg-red-50 p-2 text-center text-sm text-red-500">
            {route.prompt}
          </div>
        )}
      </>
    );
  };

  return (
    <>
      {isLoading && <FullscreenLoader />}
      <NavBar className="bg-white" onBack={() => router.push("/")}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>
      <div className="flex-1 overflow-auto">
        <div className="bg-[url('/m/images/estimation/bg.webp')] bg-center pt-[30%]" />
        <div className="bg-[#fff] p-5">
          <Form onSubmit={onSubmit}>
            <div className="flex w-full gap-8">
              <Autocomplete
                className="flex-1"
                defaultItems={countries}
                inputProps={{
                  classNames: {
                    input: "text-base",
                  },
                }}
                label={t("warehouse")}
                name="countryId"
                selectedKey={String(formData.countryId)}
                size="sm"
                onSelectionChange={(key) =>
                  handleChange("countryId", Number(key))
                }
              >
                {(country: any) => (
                  <AutocompleteItem
                    key={country.id}
                    className="text-base"
                    startContent={
                      <Avatar
                        alt={country.name}
                        className="h-6 w-6"
                        src={country.nationalFlag}
                      />
                    }
                  >
                    {country.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>
            <Autocomplete
              className="flex-1"
              defaultItems={categoryOptions}
              inputProps={{
                classNames: {
                  input: "text-base",
                },
              }}
              label={t("category")}
              name="categoryId"
              selectedKey={String(formData.categoryId)}
              size="sm"
              onSelectionChange={(key) => handleChange("categoryId", key)}
            >
              {(category: any) => (
                <AutocompleteItem key={category.id}>
                  {category.categoryName}
                </AutocompleteItem>
              )}
            </Autocomplete>

            <div className="flex flex-1 gap-2">
              <Input
                className="flex-1 text-base"
                classNames={{
                  input: "text-base",
                }}
                label={t("weight")}
                name="weight"
                size="sm"
                type="number"
                value={formData.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
              />
              <Input
                className="flex-1 text-base"
                classNames={{
                  input: "text-base",
                }}
                label={t("length")}
                name="length"
                size="sm"
                type="number"
                value={formData.length}
                onChange={(e) => handleChange("length", e.target.value)}
              />
            </div>
            <div className="flex flex-1 gap-2">
              <Input
                className="flex-1 text-base"
                classNames={{
                  input: "text-base",
                }}
                label={t("width")}
                name="width"
                size="sm"
                type="number"
                value={formData.width}
                onChange={(e) => handleChange("width", e.target.value)}
              />
              <Input
                className="flex-1 text-base"
                classNames={{
                  input: "text-base",
                }}
                label={t("height")}
                name="height"
                size="sm"
                type="number"
                value={formData.height}
                onChange={(e) => handleChange("height", e.target.value)}
              />
            </div>

            <Spacer y={2} />
            <Button
              className="w-full bg-[#f0700c] text-white"
              isLoading={loading}
              type="submit"
              variant="bordered"
            >
              {t("search")}
            </Button>
          </Form>
          {routes.length > 0 && (
            <div className="mt-3">
              <Accordion
                className="!border-1"
                disabledKeys={disabledKeys}
                variant="bordered"
              >
                {routes.map((route, index) => (
                  <AccordionItem
                    key={index}
                    title={<ShippingRouteCard route={route} />}
                  >
                    {/* 展开后的内容 */}
                    <div className="flex flex-col gap-3 pb-3">
                      {/* 价格规则 */}
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

                      {/* 限重 + 特点 */}
                      <div className="flex flex-col gap-2 rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
                        {/* 限重 */}
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

                        {/* 特点 */}
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
            </div>
          )}
          {routes?.length < 1 && (
            <div className="mt-5 flex flex-col items-center justify-center text-gray-500">
              <p className="text-lg">{routesMessage}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
