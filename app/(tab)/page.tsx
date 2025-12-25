"use client";
import {
  IoLanguageSharp,
  IoLogoUsd,
  IoSearch,
  IoChevronForwardSharp,
} from "react-icons/io5";
import { addToast, Button, Input, Spinner } from "@heroui/react"; // 加了 Spinner
import { Swiper, Image, Avatar } from "antd-mobile";
import { useRouter } from "next/navigation";
import { FaRegImage } from "react-icons/fa";
import { useRef, useState } from "react"; // 加了 useState
import { useTranslations } from "next-intl";

import { Logo } from "@/components/icons";
import { getGoodsImageId } from "@/services";
import FullscreenLoader from "@/components/common/fullscreen-loader";

export default function Home() {
  const t = useTranslations("home");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false); // 上传中状态
  const toolTab = [
    {
      image: "/m/images/home/tab1.png",
      href: "https://discord.gg/N34Q27Vts8",
    },
    {
      image: "/m/images/home/tab2.png",
      href: "/m/dashboard",
    },
    {
      image: "/m/images/home/tab3.png",
      href: "/m/estimation",
    },
    {
      image: "/m/images/home/tab4.png",
      href: "/m/register",
    },
  ];
  const toolList = [
    {
      image: "/m/images/home/Guide.png",
      title: t("toolList.guide"),
      to: "/help/guide",
    },
    {
      image: "/m/images/home/Community.png",
      title: t("toolList.community"),
      to: "https://discord.gg/N34Q27Vts8",
      // to: "/pages/member/promotion/index",
    },
    {
      image: "/m/images/home/Forwarding.png",
      title: t("toolList.forwarding"),
      to: "/forwarding",
    },
    {
      image: "/m/images/home/FillBuy.png",
      title: t("toolList.fillBuy"),
    },
  ];
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
        title: t("toast.uploadFail"),
        timeout: 1000,
        color: "danger",
      });
    } finally {
      setUploading(false); // 上传结束
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerUpload = (e: any) => {
    e.stopPropagation(); // 阻止冒泡
    fileInputRef.current?.click();
  };

  {
    uploading && <FullscreenLoader />;
  }

  return (
    <section className="hide-scrollbar flex flex-1 flex-col overflow-auto p-3 pb-0">
      <div>
        <div className="mt-2 flex justify-between">
          <div>
            <Logo height={21} width={100} />
          </div>
          <div className="flex items-center">
            {/* <IoPeopleCircle className="h-[20px] w-[20px] text-[#ea8407]" /> */}
            <IoLanguageSharp
              className="h-[20px] w-[20px] text-[#ea8407]"
              onClick={() => router.push("/setting/language")}
            />
            <IoLogoUsd
              className="h-[20px] w-[20px] text-[#ea8407]"
              onClick={() => router.push("/setting/currency")}
            />
          </div>
        </div>
        <div className="my-4">
          <Button
            className="w-full justify-between bg-white"
            endContent={
              uploading ? (
                <Spinner color="primary" size="sm" /> // 上传中圈圈
              ) : (
                <FaRegImage className="text-xl" onClick={triggerUpload} />
              )
            }
            startContent={
              <div className="flex items-center gap-2 bg-white text-base">
                <IoSearch className="text-xl" />
                {t("search.placeholder")}
              </div>
            }
            onPress={() => router.push("/goods/search")}
          />
          <input
            ref={fileInputRef}
            hidden
            accept="image/*"
            type="file"
            onChange={handleImageUpload}
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto scrollbar-hide">
        <Swiper>
          <Swiper.Item>
            <Image
              className="rounded-lg"
              fit="contain"
              src="/m/images/home/Swiper.png"
            />
          </Swiper.Item>
        </Swiper>
        <div className="box-card flex py-3">
          {toolList.map((item, index) => {
            return (
              <div
                key={item.title}
                className="flex flex-1 flex-col items-center justify-center text-center"
                role="button"
                onClick={() => router.push(item?.to || "")}
              >
                <div>
                  <Avatar src={item.image} />
                </div>
                <p className="mt-3 text-sm">{item.title}</p>
              </div>
            );
          })}
        </div>

        <div
          className="box-card py-2"
          role="button"
          onClick={() => router.push("/estimation")}
        >
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex-1 text-sm font-bold">
              {t("shipping.title")}
            </div>
            <div className="flex-1">
              <Input
                readOnly
                aria-label="Search"
                classNames={{
                  inputWrapper: "bg-[#f7f8f9]",
                  input: "text-sm",
                }}
                endContent={<IoSearch className="text-[#f0700c]" />}
                labelPlacement="outside"
                placeholder={t("shipping.placeholder")}
                size="sm"
                type="search"
              />
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-2 pt-0">
            <div className="flex items-center">
              <div className="mr-[5px] h-[6px] w-[6px] rounded-full bg-orange-500" />
              <span className="text-sm">{t("shipping.lineFast")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#f0700c]">71</span>
              <IoChevronForwardSharp />
            </div>
          </div>
        </div>
        <Image
          className="mt-5 h-auto w-full rounded-lg object-cover"
          src={"/m/images/home/footer.jpg"}
        />
        <div className="my-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {toolTab.map((item, index) => {
            return (
              <a key={index} href={item.href}>
                <Image
                  className="h-auto w-full rounded-lg object-cover"
                  height={100}
                  src={item.image}
                />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
