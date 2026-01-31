import { Tab, Tabs } from "@heroui/react";
import React from "react";

interface TabItem {
  key: string;
  title: string;
  content: React.ReactNode;
}

interface CommonTabsProps {
  tabs: TabItem[];
  onSelectionChange?: (key: React.Key) => void;
  defaultSelectedKey?: string;
}

export default function CommonTabs({
  tabs,
  onSelectionChange,
  defaultSelectedKey,
}: CommonTabsProps) {
  return (
    <Tabs
      aria-label="Options"
      classNames={{
        base: "w-full bg-white p-1 flex-1 max-h-[48px]",
        tabList: "gap-6 w-full relative rounded-none p-0 justify-center",
        tab: "px-0 h-12 flex-1",
        cursor: "w-full bg-[#f0700c] z-999 ",
        tabContent: "group-data-[selected=true]:text-[#f0700c] font-bold",
        panel: "bg-[#f7f8f9] px-2 flex-1 overflow-auto scrollbar-hide mt-2 pt-0",
      }}
      defaultSelectedKey={defaultSelectedKey}
      variant="underlined"
      onSelectionChange={onSelectionChange}
    >
      {tabs.map((tab) => (
        <Tab key={tab.key} title={tab.title}>
          {tab.content}
        </Tab>
      ))}
    </Tabs>
  );
}
