"use client";

import { Autocomplete, AutocompleteItem, Avatar } from "@heroui/react";
import { useTranslations } from "next-intl";

import {
  useCountries,
  useProvinces,
  useCities,
} from "@/hook/api";

interface Option {
  id: string | number; // 接口可能是 number，也可能是 string
  code?: string;
  name: string;
  nationalFlag?: string;
}

interface Props {
  value: {
    countryId: string;
    stateId: string;
    city: string;
  };
  onChange: (val: Props["value"]) => void;
}

export default function AreaSelector({ value, onChange }: Props) {
  const t = useTranslations("components.areaSelector");
  const { data: countries = [] } = useCountries();
  console.log('countries', countries);
  
  const { data: states = [] } = useProvinces(value.countryId);
  const { data: cities = [] } = useCities(value.stateId);

  const renderItem =
    (key: keyof Option = "id") =>
    // eslint-disable-next-line react/display-name
    (opt: Option) => (
      <AutocompleteItem
        key={String(opt[key])}
        startContent={
          opt.nationalFlag ? (
            <Avatar alt={opt.name} className="h-6 w-6" src={opt.nationalFlag} />
          ) : null
        }
      >
        {opt.name}
      </AutocompleteItem>
    );

  return (
    <div className="flex flex-col gap-4">
      <Autocomplete
        // 输入框配置（特别针对 iOS）
        errorMessage={t("country.errorMessage")}
        inputProps={{
          classNames: {
            input: "text-base",
          },
          // 这些属性在 iOS 上特别重要
          enterKeyHint: "done",
          inputMode: "search", // iOS 上使用搜索模式
          // 防止 iOS 自动修正和自动大写
          autoCapitalize: "none",
          autoComplete: "off",
          autoCorrect: "off",
          spellCheck: "false",
        }}
        isRequired={true}
        label={t("country.label")}
        placeholder={t("country.placeholder")}
        selectedKey={String(value.countryId) || null}
        variant="bordered"
        onSelectionChange={(code) =>
          onChange({
            countryId: String(code),
            stateId: "",
            city: "",
          })
        }
      >
        {countries.map(renderItem())}
      </Autocomplete>

      <Autocomplete
        errorMessage={t("state.errorMessage")}
        inputProps={{
          classNames: {
            input: "text-base",
          },
          // 这些属性在 iOS 上特别重要
          enterKeyHint: "done",
          inputMode: "search", // iOS 上使用搜索模式
          // 防止 iOS 自动修正和自动大写
          autoCapitalize: "none",
          autoComplete: "off",
          autoCorrect: "off",
          spellCheck: "false",
        }}
        isRequired={true}
        label={t("state.label")}
        placeholder={t("state.placeholder")}
        selectedKey={String(value.stateId) || null}
        variant="bordered"
        onSelectionChange={(code) => {
          return onChange({
            ...value,
            stateId: String(code),
            city: states?.find((item: any) => item.id == code)?.name || "",
          });
        }}
      >
        {states.map(renderItem())}
      </Autocomplete>

      {cities.length > 0 ? (
        <Autocomplete
          errorMessage={t("city.errorMessage")}
          inputProps={{
            classNames: {
              input: "text-base",
            },
            // 这些属性在 iOS 上特别重要
            enterKeyHint: "done",
            inputMode: "search", // iOS 上使用搜索模式
            // 防止 iOS 自动修正和自动大写
            autoCapitalize: "none",
            autoComplete: "off",
            autoCorrect: "off",
            spellCheck: "false",
          }}
          isRequired={true}
          label={t("city.label")}
          placeholder={t("city.placeholder")}
          selectedKey={String(value.city) || null}
          variant="bordered"
          onSelectionChange={(code) =>
            onChange({
              ...value,
              city: String(code),
            })
          }
        >
          {cities.map(renderItem("name"))}
        </Autocomplete>
      ) : null}
    </div>
  );
}
