"use client";
import {
  IoLanguageSharp,
  IoLogoUsd,
  IoSearch,
  IoChevronForwardSharp,
} from "react-icons/io5";
import { addToast, Button, Spinner } from "@heroui/react"; // 加了 Spinner
import { Swiper, Image, Avatar } from "antd-mobile";
import { useRouter } from "next/navigation";
import { FaRegImage } from "react-icons/fa";
import { useRef, useState, useEffect } from "react"; // 加了 useState
import { useTranslation } from "react-i18next";

import { getGoodsImageId } from "@/services";
import { Logo } from "@/components/icons";

export default function Home() {
  const { t } = useTranslation("translation", { keyPrefix: "home" });

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false); // 上传中状态
  const [isScrolled, setIsScrolled] = useState(false); // 滚动状态

  // 监听滚动事件，改变 Header 背景
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toolTab = [
    {
      image: "/images/home/tab1.png",
      href: "https://discord.gg/N34Q27Vts8",
    },
    {
      image: "/images/home/tab2.png",
      href: "/m/dashboard",
    },
    {
      image: "/images/home/tab3.png",
      href: "/m/estimation",
    },
    {
      image: "/images/home/tab4.png",
      href: "/m/register",
    },
  ];
  const toolList = [
    {
      image: "/images/home/Guide.png",
      title: t("toolList.guide"),
      to: "/help/guide",
    },
    {
      image: "/images/home/Community.png",
      title: t("toolList.community"),
      to: "/promotion",
    },
    {
      image: "/images/home/Forwarding.png",
      title: t("toolList.forwarding"),

      to: "/forwarding",
    },
    {
      image: "/images/home/FillBuy.png",
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
        title: "toast.uploadFail",
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
  }

  return (
    <>
      {/* 顶部固定区域：Logo、图标、搜索栏 */}
      <header className="p-2">
        <div className="mb-2 flex items-center justify-between">
          <Logo height={21} width={100} />
          <div className="flex items-center">
            {/* <IoPeopleCircle className="h-[24px] w-[24px] text-[#ea8407]" /> */}
            <div role="button" onClick={() => router.push("/setting/language")}>
              <IoLanguageSharp className="h-[22px] w-[22px] text-[#ea8407]" />
            </div>
            <div role="button" onClick={() => router.push("/setting/currency")}>
              <IoLogoUsd className="h-[22px] w-[22px] text-[#ea8407]" />
            </div>
          </div>
        </div>

        <div className="relative">
          <Button
            className="w-full justify-between bg-white shadow-sm"
            endContent={
              uploading ? (
                <Spinner color="primary" size="sm" />
              ) : (
                <FaRegImage
                  className="text-xl text-gray-500"
                  onClick={triggerUpload}
                />
              )
            }
            startContent={
              <div className="flex items-center gap-2 text-gray-500">
                <IoSearch className="text-xl" />
                <span className="text-sm">{t("search.placeholder")}</span>
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
      </header>

      {/* 可滚动内容区域 */}
      <main className="flex-1 space-y-4 overflow-auto p-2">
        {/* 轮播图 */}
        <div className="overflow-hidden rounded-xl">
          <Swiper autoplay loop>
            <Swiper.Item>
              <Image
                className="w-full object-cover"
                fit="contain"
                src="/images/home/Swiper.png"
              />
            </Swiper.Item>
          </Swiper>
        </div>

        {/* 工具图标栏 */}
        <div className="box-card flex py-4 shadow-sm">
          {toolList.map((item) => (
            <button
              key={item.title}
              className="flex flex-1 flex-col items-center justify-center gap-2 active:opacity-70"
              onClick={() => router.push(item?.to || "")}
            >
              <Avatar className="h-10 w-10 bg-transparent" src={item.image} />
              <span className="text-xs font-medium text-gray-700">
                {item.title}
              </span>
            </button>
          ))}
        </div>

        {/* 运费估算卡片 */}
        <button
          className="box-card w-full overflow-hidden shadow-sm transition-transform active:scale-[0.99]"
          onClick={() => router.push("/estimation")}
        >
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-base font-bold text-gray-900">
              {t("shipping.title")}
            </span>
            <div className="flex h-8 items-center rounded-full bg-[#f7f8f9] px-3 text-xs text-gray-400">
              <span className="mr-2">{t("shipping.placeholder")}</span>
              <IoSearch className="text-[#f0700c]" />
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-orange-500" />
              <span className="text-sm font-medium text-gray-700">
                {t("shipping.lineFast")}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#f0700c]">
              <span className="text-lg font-bold">71</span>
              <IoChevronForwardSharp />
            </div>
          </div>
        </button>

        {/* 底部 Banner */}
        <div className="overflow-hidden rounded-xl shadow-sm">
          <Image
            className="w-full object-cover"
            src={"/images/home/footer.jpg"}
          />
        </div>

        {/* 底部 Grid 菜单 */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {toolTab.map((item, index) => (
            <a
              key={index}
              className="overflow-hidden rounded-xl shadow-sm transition-opacity active:opacity-80"
              href={item.href}
            >
              <Image className="w-full object-cover" src={item.image} />
            </a>
          ))}
        </div>
      </main>
    </>
  );
}
