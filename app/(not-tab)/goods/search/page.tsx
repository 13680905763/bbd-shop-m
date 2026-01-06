"use client";
import { addToast, Button, Divider, Form, Input, Spinner } from "@heroui/react";
import React, { useRef, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { FaRegImage } from "react-icons/fa";
import { useTranslations } from "next-intl";

import { getGoodsId, getGoodsImageId } from "@/services";
import { SearchIcon } from "@/components/icons";

export default function Searchpage() {
  const t = useTranslations("goods.search");

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false); // 新增上传中状态

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true); // 开始上传
      const res: any = await getGoodsImageId(file);

      if (res && res.length > 0) {
        const taobaoImageId = res.find(
          (item: any) => item.source === "TAOBAO",
        )?.imageId;
        const alibabaImageId = res.find(
          (item: any) => item.source === "1688",
        )?.imageId;

        if (taobaoImageId && alibabaImageId) {
          router.push(
            `/goods/list?TAOBAO=${taobaoImageId}&1688=${alibabaImageId}`,
          );
        }
      }
    } catch (error) {
      console.error("上传图片失败", error);
      addToast({
        title: t("uploadFailed"), // 使用翻译
        timeout: 1000,
        color: "danger",
      });
    } finally {
      setUploading(false); // 结束上传
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerUpload = (e: any) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const data: any = Object.fromEntries(new FormData(e.currentTarget));

    const res: any = await getGoodsId({ url: data.url });

    router.push(`/goods/${res.source}/${res.sourceProductId}`);
  };

  return (
    <div className="bg flex h-[100vh] flex-col">
      <div className="flex items-center justify-between p-4">
        <button onClick={() => router.back()}>
          <IoChevronBack className="h-[25px] w-[25px]" />
        </button>
        <Form className="w-full max-w-xs" onSubmit={onSubmit}>
          <Input
            aria-label="Search"
            classNames={{
              inputWrapper: "bg-white",
              input: "text-base",
            }}
            endContent={
              <div className="flex flex-1 items-center gap-1">
                {uploading ? (
                  <Spinner color="primary" size="sm" />
                ) : (
                  <FaRegImage
                    className="cursor-pointer text-2xl"
                    onClick={triggerUpload}
                  />
                )}
                <Button
                  isIconOnly
                  className="w-full"
                  color="primary"
                  size="sm"
                  type="submit"
                  variant="light"
                >
                  {t("searchButton")} {/* 使用翻译 */}
                </Button>
              </div>
            }
            labelPlacement="outside"
            name="url"
            placeholder={t("searchPlaceholder")} // 使用翻译
            startContent={
              <SearchIcon className="pointer-events-none flex-shrink-0 text-base text-default-400" />
            }
            type="search"
          />
          <input
            ref={fileInputRef}
            hidden
            accept="image/*"
            type="file"
            onChange={handleImageUpload}
          />
        </Form>
      </div>

      <div className="flex-1 bg-white p-4">
        <div className="font-bold">{t("historyTitle")}</div> {/* 使用翻译 */}
        <Divider className="my-2" />
        {/* <div className="flex flex-wrap gap-2 p-2">
          <div className="bg-[#f8f8f8] p-2">123</div>
          <div className="bg-[#f8f8f8] p-2">jfaljgf;ljsa;gjs</div>
          <div className="bg-[#f8f8f8] p-2">agsahhdsfhfdh</div>
          <div className="line-clamp-1 overflow-hidden text-ellipsis text-nowrap bg-[#f8f8f8] p-2">
            https://item.taobao.com/item.htm?id=775526482716&pisk=gv1sHpjcscm62vdxld4e...
          </div>
        </div> */}
      </div>
    </div>
  );
}
