"use client";

import { Autocomplete, AutocompleteItem, Avatar } from "@heroui/react";

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
        label="国家"
        placeholder="选择国家"
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
        label="省份"
        placeholder="选择省份"
        selectedKey={String(value.stateId) || null}
        variant="bordered"
        onSelectionChange={(code) =>
          onChange({
            ...value,
            stateId: String(code),
            city: "",
          })
        }
      >
        {states.map(renderItem)}
      </Autocomplete>

      <Autocomplete
        label="城市"
        placeholder="选择城市"
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
    </div>
  );
}
