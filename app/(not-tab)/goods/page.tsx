"use client";
import { NavBar, Swiper, Image, ImageViewer } from "antd-mobile";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { IoCart, IoStar } from "react-icons/io5";
import {
  addToast,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { GrPowerReset } from "react-icons/gr";
import { IoIosLink } from "react-icons/io";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import ProgressBar from "./component/progress-bar";
import DisclaimerDrawer from "./component/disclaimer-drawer";
import GoodsSkeleton from "./component/goods-skeleton";

import Stepper from "@/components/stepper";
import { addCart } from "@/services/cart";
import { getGoodsInfo } from "@/services/goods";
import { createOrderPreviewKeyByProduct } from "@/services";
import { source } from "@/types";
import CommonModal from "@/components/modal/common-modal";
import { useGlobalStore } from "@/store";

interface Sku {
  skuID: string;
  stock: number;
  propId_valueId: string;
  // 其他可能的SKU属性...
}

interface ProductInfo {
  skuList: Sku[];
  skuPropMap: Record<string, string>; // 属性ID到属性名的映射
  skuPropValueMap: Record<string, string>; // 属性值ID到属性值名的映射
}

type SkuPathDict = Record<string, string[]>; // 组合路径到SKU ID数组的映射

/**
 * 生成动态SKU路径字典
 * @param productInfo 产品信息对象
 * @returns 返回SKU路径字典，键为属性组合字符串，值为对应的SKU ID数组
 */
function generateDynamicSkuPathDict(productInfo: ProductInfo): SkuPathDict {
  const dict: SkuPathDict = {};
  const { skuList, skuPropMap, skuPropValueMap } = productInfo;

  skuList.forEach((sku) => {
    if (sku.stock <= 0) return;

    // 解析所有属性
    const props = sku.propId_valueId.split(";");
    const propertyMap: Record<string, string> = {};

    // 提取属性名和值
    props.forEach((prop) => {
      const parts = prop.split(":");

      if (parts.length !== 2) return; // 跳过格式不正确的属性

      const [propName, propValue] = parts;

      // 确保属性名和值在映射表中存在
      if (skuPropMap[propName] && skuPropValueMap[propValue]) {
        propertyMap["k" + propName] = propValue;
      }
    });

    // 获取所有属性名并按字母排序确保一致性
    const propNames = Object.keys(propertyMap);

    // 生成所有可能的组合键
    const allCombinations = getAllCombinations(propNames, propertyMap);

    // 将SKU ID添加到所有相关组合中
    allCombinations.forEach((combination) => {
      if (!dict[combination]) {
        dict[combination] = [];
      }
      dict[combination].push(sku.skuID);
    });
  });

  return dict;
}
/**
 * 生成所有可能的属性组合
 * @param propNames 属性名数组
 * @param propertyMap 属性名到属性值的映射
 * @returns 返回所有可能的属性组合字符串数组
 */
function getAllCombinations(
  propNames: string[],
  propertyMap: Record<string, string>,
): string[] {
  const combinations: string[] = [];
  const n = propNames.length;
  const total = 1 << n; // 2^n 种可能性

  for (let mask = 1; mask < total; mask++) {
    const current: string[] = [];

    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        current.push(propertyMap[propNames[i]]);
      }
    }
    combinations.push(current.join("-"));
  }

  return combinations;
}
export default function GoodsPage() {
  const { t } = useTranslation("translation", {
    keyPrefix: "goods",
  });
  const { currency } = useGlobalStore();

  const searchParam = useSearchParams();

  const params = Object.fromEntries(useSearchParams().entries());

  console.log("params", params, typeof params);

  const router = useRouter();
  const [remark, setRemark] = useState<string>();
  const [quantity, setQuantity] = useState<number>(1);

  const [goodsInfo, setGoodsInfo] = useState<any>();
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [issub, setissub] = useState<any>(false);

  const [pathMap, setPathMap] = useState<any>(null);
  const [drawerType, setDrawerType] = useState<"buyNow" | "addCart">("buyNow");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isOpen1, setIsOpen1] = useState(false);

  const [visible, setVisible] = useState(false);
  const queryClient = useQueryClient();
  const handleBuyNow = async () => {
    if (issub) return;
    // console.log("currentSku", currentSku);
    if (!currentSku) {
      addToast({
        title: "请选择商品规格",
        timeout: 1000,
        color: "danger",
      });

      return;
    }
    setissub(true);

    try {
      const key = await createOrderPreviewKeyByProduct({
        source: params.source as source,
        sourceProductId: params.sourceProductId as string,
        sourceSkuId: currentSku.skuID,
        sourceMpId: goodsInfo?.productInfo?.sourceMpId,
        sourceMpSkuId: currentSku.sourceMpSkuId,
        specId: currentSku?.specId,
        quantity,
        remark,
      });

      router.push("/submit/order?type=product&key=" + key);
    } catch (err: any) {
    } finally {
      setissub(false);
    }
  };
  const add = async () => {
    if (issub) return;
    if (!currentSku) {
      addToast({
        title: "请选择商品规格",
        color: "danger",
        timeout: 1000,
      });

      return;
    }
    setissub(true);

    const data = {
      source: params.source,
      sourceProductId: params.sourceProductId,
      sourceSkuId: currentSku.skuID,
      sourceMpId: goodsInfo?.productInfo?.sourceMpId,
      sourceMpSkuId: currentSku.sourceMpSkuId,
      specId: currentSku?.specId,
      quantity,
      remark,
    };

    try {
      const tip = await addCart(data);

      addToast({
        title: tip,
        timeout: 1000,
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["cartList"] }); // 手动刷新
    } catch (e) {
    } finally {
      setissub(false);
    }
  };

  // 切换选择状态
  const changeSelectedStatus = (index: any, indey: any) => {
    const cloned: any = structuredClone(goodsInfo);

    cloned?.productInfo.skuPropList.forEach((spec: any, idx: number) => {
      if (idx === index) {
        spec.propValueList.forEach((val: any, idy: number) => {
          if (val.selected && idy === indey) {
            val.selected = false;
          } else if (!val.selected && idy === indey) {
            val.selected = true;
          } else {
            val.selected = false;
          }
        });
      }
    });
    console.log("cloned", cloned);

    // setGoodsInfo(cloned);

    undateDisabledStatus(cloned);
  };
  const getSelectedValues = (specs: any) => {
    const arr: any = [];

    specs.forEach((spec: any) => {
      const selectedVal = spec.propValueList.find((item: any) => item.selected);

      arr.push(selectedVal ? selectedVal.valueID : undefined);
    });

    return arr;
  };
  // 更新选中状态
  const undateDisabledStatus = (cloned: any) => {
    // const cloned: any = structuredClone(goodsInfo);

    cloned?.productInfo.skuPropList.forEach((spec: any, index: number) => {
      const selectedValues = getSelectedValues(cloned.productInfo.skuPropList);

      spec.propValueList.forEach((val: any) => {
        selectedValues[index] = val.valueID;
        const key = selectedValues.filter((value: any) => value).join("-");

        if (pathMap[key]) {
          val.disabled = false;
        } else {
          val.disabled = true;
        }
      });
    });

    setGoodsInfo(cloned);
  };
  const currentSku = useMemo(() => {
    if (!goodsInfo) return;
    const selectedValues = getSelectedValues(goodsInfo.productInfo.skuPropList);

    const currentSku = goodsInfo.productInfo.skuList.find((item: any) => {
      return (
        selectedValues.filter((i: any) => item?.propId_valueId.includes(i))
          ?.length == selectedValues.length
      );
    });

    if (currentSku) return currentSku;
    // else return goodsInfo.productInfo.skuList[0];
  }, [goodsInfo]); // 依赖 cart，当 cart 变化时才重新计算

  useEffect(() => {
    setisLoading(true);
    getGoodsInfo({ ...params })
      .then((data: any) => {
        // 数据初始化
        const cloned = structuredClone(data);
        let pathMap = generateDynamicSkuPathDict(cloned.productInfo);

        setPathMap(pathMap);
        cloned.productInfo.skuPropList.forEach((spec: any) => {
          spec.propValueList.forEach((value: any) => {
            value.selected = false;
            if (pathMap[value.valueID]) {
              value.disabled = false;
            } else {
              value.disabled = true;
            }
          });
        });
        setGoodsInfo(cloned);
      })
      .catch((err) => {
        // setIsOpen1(true);
      })
      .finally(() => {
        setisLoading(false);
      });
  }, []);

  return (
    <>
      <NavBar onBack={() => router.back()}>
        <span className="text-lg font-bold text-gray-900">{t("title")}</span>
      </NavBar>

      {isLoading ? (
        <GoodsSkeleton />
      ) : (
        <>
          <div className="flex-1 overflow-auto">
            <Swiper autoplay>
              {goodsInfo?.productInfo.imgList.map((item: any) => (
                <Swiper.Item key={item}>
                  <Image
                    className="rounded-lg"
                    fit="contain"
                    height={375}
                    referrerPolicy="no-referrer"
                    src={item}
                  />
                </Swiper.Item>
              ))}
            </Swiper>
            <div className="bg-white p-4">
              <div className="text-xl font-bold text-red-500">
                {currency.symbol} {goodsInfo?.productInfo.price}
              </div>
              <div className="text-base font-bold">
                <p>{goodsInfo?.productInfo.title}</p>
                <div className="flex gap-2 text-sm text-[#f0700c]">
                  <a
                    className="flex items-center gap-1 !text-[#f0700c]"
                    href={goodsInfo?.productInfo?.productUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <IoIosLink />
                    {t("originalLink")}
                  </a>
                  <button
                    className="flex items-center gap-1"
                    // onClick={() => window.location.reload()}
                  >
                    <GrPowerReset />
                    {t("refresh")}
                  </button>
                </div>
              </div>
            </div>
            <ProgressBar />
            <DisclaimerDrawer />

            <div className="box-card mx-2 !mt-0 p-2">
              <div className="p-2 text-base font-bold"> {t("title")}</div>
              <div>
                {goodsInfo?.productDetail?.productDescImgList?.map(
                  (item: any) => {
                    return (
                      <Image
                        key={item}
                        fit="contain"
                        referrerPolicy="no-referrer"
                        src={item}
                      />
                    );
                  },
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-8 bg-white p-2 pb-[env(safe-area-inset-bottom)]">
            <div className="flex gap-4">
              <div className="flex flex-col items-center justify-center">
                <button onClick={() => router.push("/cart")}>
                  <IoCart className="h-[30px] w-[30px]" />
                </button>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div>
                  <IoStar className="h-[30px] w-[30px]" />
                </div>
              </div>
            </div>
            <div className="flex flex-1 gap-2">
              <Button
                className="flex-1 bg-[linear-gradient(to_right,#ffd01e,#ff8917)] text-white"
                onPress={() => {
                  setDrawerType("addCart");
                  onOpen();
                }}
              >
                {t("addToCart")}
              </Button>
              <Button
                className="flex-1"
                color="primary"
                onPress={() => {
                  setDrawerType("buyNow");
                  onOpen();
                }}
              >
                {t("buyNow")}
              </Button>
            </div>
          </div>
        </>
      )}

      <Drawer
        isOpen={isOpen}
        placement="bottom"
        size="lg"
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          {() => (
            <>
              <DrawerHeader className="flex items-center justify-start gap-2">
                <div className="h-[70px] w-[70px] flex-shrink-0">
                  <Image
                    fit="contain"
                    height={70}
                    referrerPolicy="no-referrer"
                    src={
                      currentSku?.imgUrl ?? goodsInfo?.productInfo.imgList[0]
                    }
                    width={70}
                    onClick={() => {
                      setVisible(true);
                    }}
                  />
                  <ImageViewer.Multi
                    images={[
                      currentSku?.imgUrl ?? goodsInfo?.productInfo.imgList[0],
                    ]}
                    visible={visible}
                    onClose={() => {
                      setVisible(false);
                    }}
                  />
                </div>
                <div className="">
                  <div>
                    {currency.symbol}
                    {currentSku?.price ?? goodsInfo?.productInfo.price}
                  </div>
                  <div className="text-sm">
                    {t("stock")}
                    {currentSku?.stock}
                  </div>
                  <div className="text-sm">
                    {t("shippingFee")}
                    {currency.symbol}
                    {goodsInfo?.productInfo?.postFee}
                  </div>
                </div>
              </DrawerHeader>
              <DrawerBody>
                {goodsInfo?.productInfo.skuPropList.map(
                  (specs: any, index: number) => {
                    return (
                      <div key={specs.propName}>
                        <div className="my-2 text-sm font-bold">
                          {specs.propName}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {specs.propValueList.map(
                            (spec: any, indey: number) => {
                              return (
                                <div
                                  key={spec.valueName}
                                  data-index={spec.selected}
                                >
                                  <Button
                                    className={`bg-white pl-2 ${spec.selected ? "border-[#f0700c] text-[#f0700c]" : "border-[#ccc]"} whitespace-normal break-words text-left`}
                                    isDisabled={spec.disabled}
                                    radius="sm"
                                    size={spec.imageUrl ? "md" : "sm"}
                                    variant="bordered"
                                    onPress={() =>
                                      changeSelectedStatus(index, indey)
                                    }
                                  >
                                    {spec.imageUrl && (
                                      <Image
                                        height={40}
                                        referrerPolicy="no-referrer"
                                        src={spec.imageUrl}
                                        width={40}
                                      />
                                    )}
                                    <span className="block">
                                      {spec.valueName}
                                    </span>
                                  </Button>
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>
                    );
                  },
                )}
                <div>
                  <div className="my-2 text-sm font-bold">{t("quantity")}</div>
                  <div className="w-[40%]">
                    <Stepper
                      value={quantity}
                      onChange={(value) => setQuantity(value)}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="my-2 text-sm font-bold"> {t("remark")}</div>
                  <Textarea
                    classNames={{
                      inputWrapper: "bg-[#f5f5f5]",
                      input: "text-base",
                    }}
                    placeholder={t("enterDescription")}
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                  />
                </div>
              </DrawerBody>
              <DrawerFooter className="pb-[env(safe-area-inset-bottom)]">
                {drawerType === "buyNow" ? (
                  <Button
                    className="w-full"
                    color="primary"
                    isDisabled={!currentSku}
                    isLoading={issub}
                    onPress={handleBuyNow}
                  >
                    {t("buyNow")}
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-[linear-gradient(to_right,#ffd01e,#ff8917)] text-white"
                    isDisabled={!currentSku}
                    isLoading={issub}
                    onPress={() => add()}
                  >
                    {t("addToCart")}
                  </Button>
                )}
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>

      <CommonModal
        confirmText={t("continueShopping")}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen1}
        showCancel={false}
        size="xl"
        title={t("riskNotice")}
        onConfirm={async () => {
          router.push("/");
        }}
        onOpenChange={setIsOpen1}
      >
        <div>
          <div className="my-4 rounded-lg bg-[#ffeee1] p-2 text-sm">
            {t("riskMessage")}
          </div>
        </div>
      </CommonModal>
    </>
  );
}
