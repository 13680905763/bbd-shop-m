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
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  addToast,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";

import { getCategory, searchWarehouseRoutesList } from "@/services";
import { useCountries } from "@/hook";
import { useGlobalStore } from "@/store";

export default function EstimationPage() {
  const t = useTranslations("estimationPage");
  const { currency } = useGlobalStore();
  const { data: countries = [] } = useCountries();
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
  /** 拉取数据 */
  const fetchData = async () => {
    try {
      const res: any = await getCategory();

      setCategoryOptions(res);
    } catch {}
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleChange = (key: string, value: any) => {
    console.log("key", key, value);

    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { weight, length, width, height } = formData;

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

    try {
      const res = await searchWarehouseRoutesList(formData);

      console.log("res", res);

      if (typeof res != "string" && res?.length) {
        setRoutes(res || []);
      } else {
        setRoutes([]);
        setRoutesMessage(res);
      }
      setRoutes(res || []);
    } catch (err) {
      setRoutes([]);
      // console.error(err);
    }
  };

  useEffect(() => {
    // 初始化加载全部
    // getWarehouseRoutesList().then((res) => {
    //   setRoutes(res || []);
    // });
  }, []);

  return (
    <div>
      <NavBar className="bg-white" onBack={() => router.push("/")}>
        {t("title")}
      </NavBar>
      <div className="w-full bg-[url('/m/images/estimation/bg.webp')] bg-center pt-[40%]" />
      <div className="bg-[#fff]">
        <div className="container m-auto p-5 text-center">
          <h1>{t("title")}</h1>
          <Spacer y={8} />
          <Form className="w-full" onSubmit={onSubmit}>
            <div className="flex w-full gap-8">
              <Autocomplete
                isRequired
                className="flex-1 text-base"
                defaultItems={countries}
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
              isRequired
              className="flex-1 text-base"
              defaultItems={categoryOptions}
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
                label={t("weight")}
                name="weight"
                size="sm"
                type="number"
                value={formData.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
              />
              <Input
                className="flex-1 text-base"
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
                label={t("width")}
                name="width"
                size="sm"
                type="number"
                value={formData.width}
                onChange={(e) => handleChange("width", e.target.value)}
              />
              <Input
                className="flex-1 text-base"
                label={t("height")}
                name="height"
                size="sm"
                type="number"
                value={formData.height}
                onChange={(e) => handleChange("height", e.target.value)}
              />
            </div>

            <Spacer y={2} />
            <div className="flex w-full justify-center">
              <Button className="min-w-48" type="submit" variant="bordered">
                {t("search")}
              </Button>
            </div>
          </Form>
        </div>
      </div>
      {routes.length > 0 && (
        <div className="p-3">
          <Accordion className="!border-1 text-base" variant="bordered">
            {routes.map((route, index) => (
              <AccordionItem
                key={index}
                className="text-base"
                title={
                  <div className="flex flex-col gap-2">
                    {/* 第一行：Logo + 名称 + 价格时效 */}
                    <div className="flex w-full items-center justify-between gap-3">
                      {/* 左侧：Logo + 名称 */}
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <Avatar
                          className="h-14 w-14 flex-shrink-0"
                          radius="sm"
                          src={route.logoUrl}
                        />
                        <div className="min-w-0">
                          <p className="line-clamp-3 text-sm font-semibold text-gray-900">
                            {route.templateName}
                          </p>
                        </div>
                      </div>

                      {/* 右侧：价格 + 时效 */}
                      <div className="flex w-[90px] flex-shrink-0 flex-col items-end text-right">
                        <span className="text-[11px] text-gray-500">
                          {t("price")}
                        </span>
                        <span className="text-base font-bold leading-none">
                          {currency.symbol} {route.shippingFee}
                        </span>

                        <span className="mt-1 text-[11px] text-gray-500">
                          {t("time")}
                        </span>
                        <span className="text-sm font-semibold leading-none">
                          {route.shippingLine.minDays}-
                          {route.shippingLine.maxDays}day
                        </span>
                      </div>
                    </div>

                    {/* 描述（灰底卡片式） */}
                    <div className="rounded-md bg-gray-50 p-2 text-xs leading-snug text-gray-600">
                      {route.shippingLine.description}
                    </div>
                  </div>
                }
              >
                <Divider className="my-3" />

                {/* 展开后的内容 */}
                <div className="flex flex-col gap-3 pb-3">
                  {/* 价格规则 */}
                  <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
                    <p className="mb-2 text-sm font-semibold">
                      {t("pricingStandard")}
                    </p>
                    <Table aria-label={t("pricingStandard")}>
                      <TableHeader>
                        <TableColumn className="text-xs">
                          {t("firstWeightFee")}
                        </TableColumn>
                        <TableColumn className="text-xs">
                          {t("additionalWeightFee")}
                        </TableColumn>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="text-sm">
                            {route.firstWeightFee}
                          </TableCell>
                          <TableCell className="text-sm">
                            {route.additionalWeightFee}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* 限重 + 特点 */}
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
                    <div className="rounded-md bg-gray-50 p-3 text-xs leading-snug text-gray-700">
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
        <div className="flex flex-col items-center justify-center text-gray-500">
          <p className="text-lg">{routesMessage}</p>
        </div>
      )}
    </div>
  );
}
