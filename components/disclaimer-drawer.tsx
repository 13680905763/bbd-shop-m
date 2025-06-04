"use client";

import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  useDisclosure,
} from "@heroui/react";
import { IoBagCheck, IoChevronForwardSharp } from "react-icons/io5";

export default function DisclaimerDrawer() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <button className="-mt-2 w-full" onClick={onOpen}>
        <div className="box-card m-2 mt-0 flex justify-between py-2 pl-6 pr-2">
          <div className="items-center">
            <div className="my-1 flex items-center gap-2 text-sm">
              <IoBagCheck className="h-[20px] w-[20px]" />
              免责声明
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
                免责声明
              </DrawerHeader>
              <DrawerBody>
                <p>
                  BBDbuy上展示的所有代购商品均来自第三方代购平台，非BBDbuy直接销售。因此，BBDbuy对侵犯知识产权和侵犯商品著作权所引起的问题不承担任何责任和法律责任。使用BBDbuy代购服务即表示您默认接受上述风险。
                </p>
              </DrawerBody>
              <DrawerFooter />
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
