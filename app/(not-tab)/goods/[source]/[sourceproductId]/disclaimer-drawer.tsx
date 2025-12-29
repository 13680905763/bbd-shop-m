"use client";

import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  useDisclosure,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { IoBagCheck, IoChevronForwardSharp } from "react-icons/io5";

export default function DisclaimerDrawer() {
  const t = useTranslations("goods.details.disclaimerDrawer");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <button className="-mt-2 w-full" onClick={onOpen}>
        <div className="box-card m-2 mt-0 flex justify-between py-2 pl-6 pr-2">
          <div className="items-center">
            <div className="my-1 flex items-center gap-2 text-sm">
              <IoBagCheck className="h-[20px] w-[20px]" />
              {t("title")}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <IoChevronForwardSharp className="h-[20px] w-[20px]" />
          </div>
        </div>
      </button>

      <Drawer isOpen={isOpen} placement="bottom" onOpenChange={onOpenChange}>
        <DrawerContent>
          {() => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                {t("buttonLabel")}
              </DrawerHeader>
              <DrawerBody>
                <p>{t("content")}</p>
              </DrawerBody>
              <DrawerFooter />
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
