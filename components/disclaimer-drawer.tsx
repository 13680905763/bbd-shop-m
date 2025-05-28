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
      <button className="w-full -mt-2" onClick={onOpen}>
        <div className="box-card flex justify-between py-2 pl-6 pr-2 m-2 mt-0">
          <div className="items-center">
            <div className="text-sm my-1 flex items-center gap-2">
              <IoBagCheck className="w-[20px] h-[20px]" />
              免责声明
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <IoChevronForwardSharp className="w-[20px] h-[20px]" />
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
                  您购买的商品将被送往 CNFans
                  仓库。到达仓库后，我们会为您检查并拍照。
                  您可以在仓库中查看和管理商品。如果您对商品到货后不满意，您可以在
                  5 天内申请退货。我们的代理商将代您与卖家协商处理售后问题。
                  退/换货时每个不同的商品将收取 0.75
                  美元左右的手续费和发货/退货运费，合计约 3 美元。
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
