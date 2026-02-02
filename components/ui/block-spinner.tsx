import { Spinner } from "@heroui/react";

export default function BlockSpinner() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 backdrop-blur-sm">
      <Spinner className="flex flex-col items-center" />
    </div>
  );
}
