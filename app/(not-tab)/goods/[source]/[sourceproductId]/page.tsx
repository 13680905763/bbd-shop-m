"use client";
import { NavBar, Swiper, Image, ImageViewer } from "antd-mobile";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { IoCart, IoStar, IoShareSocialOutline } from "react-icons/io5";
import CopyText from "@/components/ui/copy-text";
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
import { useTranslations } from "next-intl";

import ProgressBar from "./progress-bar";
import DisclaimerDrawer from "./disclaimer-drawer";

import { Stepper } from "@/components/ui";
import { getGoodsInfoById } from "@/hook/api";
import { useUserInfo } from "@/hook/business";
import { createOrderPreviewKeyByProduct } from "@/services";
import { source } from "@/types";
import CommonModal from "@/components/modal/common-modal";
import { useGlobalStore } from "@/store";
import { GoodsSkeleton } from "@/components/ui";
import { useAddCartItem, useFavoriteProduct } from "@/hook/api";
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
export default function GoodsDetails() {
  const t = useTranslations("goods.details");
  const { currency } = useGlobalStore();
  const { data: user } = useUserInfo();

  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const inviteCode = searchParams.get("inviteCode");
    if (inviteCode && typeof window !== "undefined") {
      localStorage.setItem("inviteCode", inviteCode);
    }
  }, [searchParams]);

  const [isFavorite, setIsFavorite] = useState<boolean>(false);
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
  const [qcVisible, setQcVisible] = useState(false);
  const [qcIndex, setQcIndex] = useState(0);


  const [currentImg, setCurrentImg] = useState<string>();

  const { mutateAsync: addCartItem, isPending: isAddingCart } =
    useAddCartItem();
  const { mutateAsync: favoriteProduct } = useFavoriteProduct();
  const handleBuyNow = async () => {
    if (issub) return;

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
    } catch (error: any) {
      if (!error) {
        addToast({
          title: "please login first",
          color: "danger",
        });
      }
    } finally {
      setissub(false);
    }
  };
  const handleFavorite = async () => {
    try {
      await favoriteProduct({
        source: params.source as string,
        sourceProductId: params.sourceProductId as string,
        collection: isFavorite ? 0 : 1,
      });
      setIsFavorite(!isFavorite);
    } catch (e) { }
  };
  const add = async () => {
    if (isAddingCart) return;

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
      await addCartItem(data);
    } catch (e) { }
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
  console.log('goodINfo', goodsInfo);

  const currentSku = useMemo(() => {
    if (!goodsInfo) return;
    const selectedValues = getSelectedValues(goodsInfo.productInfo.skuPropList);

    console.log("selectedValues", selectedValues);

    const currentSku = goodsInfo.productInfo.skuList.find((item: any) => {
      if (!item?.propId_valueId) return false;

      // 1. 将 propId_valueId 字符串拆分成数组
      const propValuePairs = item.propId_valueId.split(";");

      // 2. 提取所有值部分（冒号后面的部分）
      const values = propValuePairs.map((pair: any) => {
        const parts = pair.split(":");

        return parts[1]; // 获取值部分
      });

      // 3. 检查每个选中的值是否都在 values 数组中
      return selectedValues.every((selectedValue: any) =>
        values.includes(selectedValue),
      );
    });

    console.log("currentSku", currentSku);

    if (currentSku) return currentSku;
    // else return goodsInfo.productInfo.skuList[0];
  }, [goodsInfo]); // 依赖 cart，当 cart 变化时才重新计算
  // Calculate display values for sales, weight, etc.
  const displayValues = useMemo(() => {
    const defaultSales = goodsInfo?.productInfo?.sales || "--";
    const daysToArrival = goodsInfo?.productInfo?.daysToArrival || "--";

    let weight = "--";
    let size = "--";

    // Attempt to find specific SKU info from skuVmMap if available
    if (goodsInfo?.productInfo?.skuVmMap) {
      // Priority: Current SKU -> First available SKU in map -> Default
      const skuId = currentSku?.skuID;
      const skuData = skuId ? goodsInfo.productInfo.skuVmMap[skuId] : null;

      // Fallback to first item in skuVmMap if current not found, or just keep default
      const firstSkuKey = Object.keys(goodsInfo.productInfo.skuVmMap)[0];
      const fallbackData = firstSkuKey
        ? goodsInfo.productInfo.skuVmMap[firstSkuKey]
        : null;

      const activeData = skuData || fallbackData;

      if (activeData) {
        if (activeData.weight) weight = activeData.weight;
        if (activeData.length && activeData.width && activeData.height) {
          size = `${activeData.length}x${activeData.width}x${activeData.height}`;
        }
      }
    }

    return {
      sales: defaultSales,
      daysToArrival,
      weight,
      size,
    };
  }, [goodsInfo, currentSku]);

  useEffect(() => {
    setisLoading(true);
    getGoodsInfoById({ ...params })
      .then((data: any) => {
        // 数据初始化
        console.log("data", data);

        setIsFavorite(data.collection);
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
        setIsOpen1(true);
      })
      .finally(() => {
        setisLoading(false);
      });
  }, []);

  return (
    <>
      <NavBar className="bg-white" onBack={() => router.back()}>
        <span className="navbar-title">{t("title")}</span>
      </NavBar>

      {isLoading ? (
        <GoodsSkeleton />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
            <Swiper autoplay>
              {goodsInfo?.productInfo.imgList.map((item: any) => (
                <Swiper.Item key={item}>
                  <Image
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
                    onClick={() => window.location.reload()}
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
              <div className="p-2 text-base font-bold">
                {t("singleItemSalesTitle")}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-1 flex-col justify-between rounded-lg bg-gray-50 p-3 text-center">
                  <div className="mb-1 text-sm text-gray-500">
                    {t("avgArrivalTime")}
                  </div>
                  <div className="font-semibold">
                    {displayValues.daysToArrival} days
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between rounded-lg bg-gray-50 p-3 text-center">
                  <div className="mb-1 text-sm text-gray-500">
                    {t("salesVolume")}
                  </div>
                  <div className="font-semibold">{displayValues.sales}</div>
                </div>
                <div className="flex flex-1 flex-col justify-between rounded-lg bg-gray-50 p-3 text-center">
                  <div className="mb-1 text-sm text-gray-500">
                    {t("weightWithUnit")}
                  </div>
                  <div className="font-semibold">{displayValues.weight}</div>
                </div>
                <div className="flex flex-1 flex-col justify-between rounded-lg bg-gray-50 p-3 text-center">
                  <div className="mb-1 text-sm text-gray-500">
                    {t("volumeWithUnit")}
                  </div>
                  <div className="font-semibold">{displayValues.size}</div>
                </div>
              </div>
            </div>
            {goodsInfo?.productInfo?.qcList?.length && (
              <div className="box-card mx-2 !mt-0 p-2">
                <div className="p-2 text-base font-bold">Product QC</div>
                <div className="mx-auto grid grid-cols-5 gap-y-2">
                  {goodsInfo?.productInfo?.qcList.map(
                    (url: string, index: number) => (
                      <div key={index} className="flex justify-center">
                        <Image
                          className="cursor-pointer"
                          height={60}
                          src={url}
                          width={60}
                          onClick={() => {
                            setQcIndex(index);
                            setQcVisible(true);
                          }}
                        />
                      </div>
                    ),
                  )}
                  <ImageViewer.Multi
                    defaultIndex={qcIndex}
                    images={goodsInfo?.productInfo?.qcList}
                    visible={qcVisible}
                    onClose={() => {
                      setQcVisible(false);
                    }}
                  />
                </div>
              </div>
            )}
            {/* 商品详情 */}
            <div className="box-card mx-2 p-2 pb-24">
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

          <div className="flex items-center justify-between gap-8 bg-white p-2">
            <div className="flex gap-2">
              <div className="flex flex-col items-center justify-center">
                <button onClick={() => router.push("/cart")}>
                  <IoCart className="h-[30px] w-[30px]" />
                </button>
              </div>
              <div className="flex flex-col items-center justify-center">
                <button onClick={handleFavorite}>
                  <IoStar
                    className={`h-[30px] w-[30px] ${isFavorite ? "text-[#f0700c]" : ""}`}
                  />
                </button>
              </div>
              <div className="flex flex-col items-center justify-center">
                <CopyText
                  text={
                    typeof window !== "undefined"
                      ? `${window.location.href}${
                          user?.inviteCode
                            ? (window.location.href.includes("?") ? "&" : "?") +
                              "inviteCode=" +
                              user.inviteCode
                            : ""
                        }`
                      : ""
                  }
                >
                  <IoShareSocialOutline className="h-[28px] w-[28px] text-gray-700 hover:text-primary transition-colors" />
                </CopyText>
              </div>
            </div>
            <div className="flex flex-1 gap-2">
              <Button
                className="flex-1 bg-[linear-gradient(to_right,#ffd01e,#ff8917)] text-white"
                onPress={() => {
                  if (!user) return router.push("/login");
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
                  if (!user) return router.push("/login");
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
                      currentSku?.imgUrl ?? currentImg ?? goodsInfo?.productInfo.imgList[0]
                    }
                    width={70}
                    onClick={() => {
                      setVisible(true);
                    }}
                  />
                  <ImageViewer.Multi
                    images={[
                      currentSku?.imgUrl ?? currentImg ?? goodsInfo?.productInfo.imgList[0],
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
                                    onPress={() => {
                                      setCurrentImg(spec.imageUrl)
                                      changeSelectedStatus(index, indey)
                                    }}
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
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold">{t("quantity")}</div>
                  <Stepper
                    value={quantity}
                    min={goodsInfo?.productInfo
                      ?.minNum || 1}
                    onChange={(value) => setQuantity(value)}
                  />
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
              <DrawerFooter>
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
                    isLoading={isAddingCart}
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
        hideCloseButton={true}
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        isOpen={isOpen1}
        showCancel={false}
        size="xl"
        title={t("riskNotice")}
        onConfirm={async () => {
          router.push("/");
        }}
        onOpenChange={setIsOpen1}
      >
        <div className="my-4 rounded-lg bg-[#ffeee1] p-2 text-sm">
          {t("riskDescription")}
        </div>
      </CommonModal>
    </>
  );
}
