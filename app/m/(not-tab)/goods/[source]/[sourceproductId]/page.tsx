"use client";
import { NavBar, Swiper, Image } from "antd-mobile";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { IoCart, IoStar } from "react-icons/io5";
import {
  addToast,
  Avatar,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import NextLink from "next/link";

import { getGoodsInfo } from "@/services/api/goods";
import ProgressBar from "@/components/progress-bar";
import DisclaimerDrawer from "@/components/disclaimer-drawer";
import Stepper from "@/components/stepper";
import { addCart } from "@/services/api/cart";
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
        propertyMap[skuPropMap[propName]] = skuPropValueMap[propValue];
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
  const params = useParams();

  console.log("params", params);

  const router = useRouter();
  const [goodsInfo, setGoodsInfo] = useState<any>();
  const [isLoading, setisLoading] = useState<any>(false);

  const [pathMap, setPathMap] = useState<any>(null);
  const [isbuy, setIsbuy] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const add = () => {
    setisLoading(true);

    const data = {
      source: params.source,
      sourceProductId: params.sourceproductId,
      sourceSkuId: currentSku.skuID,
      // specId: "f561c4f7cdb23de81fc2303ebf1e8f55",

      quantity: 1,
      remark: "demoData",
    };

    console.log(data);

    addCart(data).then((res: any) => {
      console.log(res);
      addToast({
        title: res.msg,
        timeout: 1000,
        color: "success",
      });
      setisLoading(false);
    });
  };
  const showDrawer = (showtype: any) => {
    setIsbuy(showtype);
    onOpen();
  };
  // 切换选择状态
  const changeSelectedStatus = (index: any, indey: any) => {
    const cloned: any = structuredClone(goodsInfo);

    console.log("cloned", cloned, pathMap);

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

      arr.push(selectedVal ? selectedVal.valueName : undefined);
    });

    return arr;
  };
  // 更新选中状态
  const undateDisabledStatus = (cloned: any) => {
    // const cloned: any = structuredClone(goodsInfo);

    console.log("goodsInfo666", goodsInfo);

    cloned?.productInfo.skuPropList.forEach((spec: any, index: number) => {
      const selectedValues = getSelectedValues(cloned.productInfo.skuPropList);

      spec.propValueList.forEach((val: any) => {
        selectedValues[index] = val.valueName;
        console.log("selectedValues", selectedValues, val.valueName);
        const key = selectedValues.filter((value: any) => value).join("-");

        console.log("key", key);
        if (pathMap[key]) {
          val.disabled = false;
        } else {
          val.disabled = true;
        }
      });
    });
    console.log("cloned", cloned);

    setGoodsInfo(cloned);
  };
  const currentSku = useMemo(() => {
    if (!goodsInfo) return;
    const selectedValues = getSelectedValues(goodsInfo.productInfo.skuPropList);

    console.log("sku", selectedValues);

    const currentSku = goodsInfo.productInfo.skuList.find((item: any) => {
      console.log("item", item);

      return (
        selectedValues.filter((i: any) => item?.propName_valueName.includes(i))
          ?.length == selectedValues.length
      );
    });

    if (currentSku) return currentSku;
    // else return goodsInfo.productInfo.skuList[0];
  }, [goodsInfo]); // 依赖 cart，当 cart 变化时才重新计算

  console.log("currentSku", currentSku);

  useEffect(() => {
    getGoodsInfo({ ...params }).then((res: any) => {
      if (res.success) {
        // 数据初始化
        const cloned = structuredClone(res.data);
        let pathMap = generateDynamicSkuPathDict(cloned.productInfo);

        setPathMap(pathMap);
        cloned.productInfo.skuPropList.forEach((spec: any) => {
          spec.propValueList.forEach((value: any) => {
            value.selected = false;
            console.log("value.valueName", value.valueName, pathMap);

            if (pathMap[value.valueName]) {
              value.disabled = false;
            } else {
              value.disabled = true;
            }
          });
        });
        console.log("cloned", cloned);

        setGoodsInfo(cloned);
      }
    });
  }, []);

  return (
    <div className="h-[100vh] flex flex-col justify-between">
      <NavBar className="bg-white" onBack={() => router.back()}>
        商品详情
      </NavBar>
      <div className="flex-1 overflow-auto">
        <Swiper autoplay>
          {goodsInfo?.productInfo.imgList.map((item: any) => (
            <Swiper.Item key={item}>
              <Image
                className="rounded-lg"
                fit="contain"
                height={375}
                src={item}
              />
            </Swiper.Item>
          ))}
        </Swiper>
        <div className="p-4 bg-white">
          <div className="font-bold text-xl text-red-500">
            ￥ {goodsInfo?.productInfo.price}
          </div>
          <div className="font-bold text-base">
            {goodsInfo?.productInfo.title}
          </div>
        </div>
        <ProgressBar />
        <DisclaimerDrawer />

        <div className="box-card mx-2 p-2 !mt-0">
          <div className="font-bold text-base p-2">商品详情</div>
          <div>
            {goodsInfo?.productDetail?.productDescImgList.map((item: any) => {
              return <Image key={item} fit="contain" src={item} />;
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center p-2 gap-8   bg-white">
        <div className="flex gap-4">
          <div className="flex flex-col items-center justify-center">
            <NextLink href="/m/cart">
              <div>
                <IoCart className="w-[30px] h-[30px]" />
              </div>
            </NextLink>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div>
              <IoStar className="w-[30px] h-[30px]" />
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-1">
          <Button
            className="flex-1 bg-[linear-gradient(to_right,#ffd01e,#ff8917)] text-white"
            onPress={() => showDrawer(false)}
          >
            加入购物车
          </Button>
          <Button
            className="flex-1"
            color="primary"
            onPress={() => showDrawer(true)}
          >
            立即购买
          </Button>
        </div>
      </div>

      <Drawer
        isOpen={isOpen}
        placement="bottom"
        size="2xl"
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          {() => (
            <>
              <DrawerHeader className="flex items-center gap-2">
                <div>
                  <Image
                    fit="contain"
                    height="70px"
                    src={
                      currentSku?.imgUrl ?? goodsInfo?.productInfo.imgList[0]
                    }
                  />
                </div>
                <div className="">
                  <div>
                    ￥ {currentSku?.price ?? goodsInfo?.productInfo.price}
                  </div>
                  <div className="text-sm">库存 : {currentSku?.stock}</div>
                </div>
              </DrawerHeader>
              <DrawerBody>
                {goodsInfo?.productInfo.skuPropList.map(
                  (specs: any, index: number) => {
                    return (
                      <div key={specs.propName}>
                        <div className="font-bold my-2 text-sm">
                          {specs.propName}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {specs.propValueList.map(
                            (spec: any, indey: number) => {
                              return (
                                <div
                                  key={spec.valueName}
                                  data-index={spec.selected}
                                >
                                  <Button
                                    className={`pl-2 bg-white ${spec.selected ? "border-[#f0700c] text-[#f0700c]" : "border-[#ccc]"} `}
                                    isDisabled={spec.disabled}
                                    radius="lg"
                                    size={spec.imageUrl ? "md" : "sm"}
                                    variant="bordered"
                                    onPress={() =>
                                      changeSelectedStatus(index, indey)
                                    }
                                  >
                                    {spec.imageUrl ? (
                                      <Avatar
                                        radius="none"
                                        src={spec.imageUrl}
                                      />
                                    ) : null}
                                    {spec.valueName}
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
                  <div className="font-bold my-2 text-sm">数量</div>
                  <div className="w-[40%]">
                    <Stepper />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="font-bold my-2 text-sm">备注</div>
                  <Textarea
                    classNames={{
                      inputWrapper: "bg-[#f5f5f5]",
                    }}
                    placeholder="Enter your description"
                  />
                </div>
              </DrawerBody>
              <DrawerFooter>
                {isbuy ? (
                  <Button className="w-full  " color="primary">
                    立即购买
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-[linear-gradient(to_right,#ffd01e,#ff8917)] text-white"
                    isLoading={isLoading}
                    onPress={() => add()}
                  >
                    加入购物车
                  </Button>
                )}
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
