"use client";

import { Autocomplete, AutocompleteItem, Avatar } from "@heroui/react";
import { useTranslations } from "next-intl";

import { useCountries, useProvinces, useCities } from "@/hook/api";

interface Option {
  id: string | number; // 接口可能是 number，也可能是 string
  code?: string;
  name: string;
  nationalFlag?: string;
}

interface Props {
  value: {
    countryId: string;
    stateId?: string;
    state?: string;
    city: string;
  };
  onChange: (val: any) => void;
}

export default function AreaSelector({ value, onChange }: Props) {
  const t = useTranslations("components.areaSelector");
  const { data: countries = [] } = useCountries();

  console.log("countries", countries);

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
    <div className="space-y-4">
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
        selectedKey={value.countryId ? String(value.countryId) : null}
        variant="bordered"
        onSelectionChange={(code) => {
          const payload = {
            countryId: String(code || ""),
            stateId: "",
            state: "",
            city: "",
          };
          onChange(payload);
        }}
      >
        {countries.map(renderItem())}
      </Autocomplete>

      <Autocomplete
        allowsCustomValue
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
        isRequired={false}
        label={t("state.label")}
        placeholder={t("state.placeholder")}
        selectedKey={value.stateId ? String(value.stateId) : null}
        inputValue={states?.find((s: any) => String(s.id) === String(value.stateId))?.name || value.state || value.stateId || ""}
        variant="bordered"
        onSelectionChange={(code) => {
          if (code !== null) {
            return onChange({
              ...value,
              stateId: String(code),
              state: "",
            });
          }
        }}
        onInputChange={(text) => {
          const match = states?.find((item: any) => item.name === text);
          if (match) {
            return onChange({
              ...value,
              stateId: String(match.id),
              state: "",
            });
          } else {
            return onChange({
              ...value,
              stateId: "",
              state: text,
            });
          }
        }}
      >
        {states.map(renderItem())}
      </Autocomplete>


      <Autocomplete
        allowsCustomValue
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
        selectedKey={value.city ? String(value.city) : null}
        inputValue={value.city || ""}
        variant="bordered"
        onSelectionChange={(code) => {
          if (code !== null) {
            onChange({
              ...value,
              city: String(code),
            });
          }
        }}
        onInputChange={(text) => {
          onChange({
            ...value,
            city: text,
          });
        }}
      >
        {cities.map(renderItem("name"))}
      </Autocomplete>

    </div>
  );
}
