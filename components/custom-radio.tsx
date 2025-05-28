import { cn, Radio } from "@heroui/react";

const CustomRadio = (props: any) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      size="sm"
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
          "flex-row-reverse max-w-[100%] cursor-pointer rounded-lg  p-3  border-2 border-transparent",
          "data-[selected=true]:border-primary",
        ),
      }}
    >
      {children}
    </Radio>
  );
};

export default CustomRadio;
