"use client";
import { addToast, Button, Form, Input, Spinner } from "@heroui/react";
import React, { useRef, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { FaRegImage } from "react-icons/fa";
import { useTranslations } from "next-intl";

import { productApi } from "@/services/productApi";

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
      const res: any = await productApi.searchByUpload(file);

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

    const res: any = await productApi.smartSearch({ url: data.url });

    if (res.keyword) {
      router.push(`/goods/list?keyword=${encodeURIComponent(data.url)}`);
    } else {
      router.push(`/goods/${res.source}/${res.sourceProductId}`);
    }
  };

  return (
    <>
      <div className="bg flex items-center justify-between p-2 py-4">
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
      </div>
    </>
  );
}
