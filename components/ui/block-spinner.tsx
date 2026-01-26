import { Spinner } from "@heroui/react";

export default function BlockSpinner() {
  return (
    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-20 flex items-center justify-center ">
      <Spinner className="flex flex-col items-center" />
    </div>
  );
}
