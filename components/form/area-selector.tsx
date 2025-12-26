"use client";

import { Autocomplete, AutocompleteItem, Avatar } from "@heroui/react";
import { useTranslation } from "react-i18next";

import {
  useCountries,
  useProvinces,
  useCities,
} from "@/hook/addresses/useAreaSelector";

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
  const { t } = useTranslation();
  const { data: countries = [] } = useCountries();
  const { data: states = [] } = useProvinces(value.countryId);
  const { data: cities = [] } = useCities(value.stateId);

  const renderItem = (opt: Option) => (
    <AutocompleteItem
      key={String(opt.id)}
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
        isRequired={true}
        label={t("components.areaSelector.country.label")}
        placeholder={t("components.areaSelector.country.placeholder")}
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
        {countries.map(renderItem)}
      </Autocomplete>

      <Autocomplete
        isRequired={true}
        label={t("components.areaSelector.state.label")}
        placeholder={t("components.areaSelector.state.placeholder")}
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
        {states.map(renderItem)}
      </Autocomplete>

      {cities.length > 0 ? (
        <Autocomplete
          isRequired={true}
          label={t("components.areaSelector.city.label")}
          placeholder={t("components.areaSelector.city.placeholder")}
          selectedKey={String(value.city) || null}
          variant="bordered"
          onSelectionChange={(code) =>
            onChange({
              ...value,
              city: String(code),
            })
          }
        >
          {cities.map(renderItem)}
        </Autocomplete>
      ) : null}
    </div>
  );
}
