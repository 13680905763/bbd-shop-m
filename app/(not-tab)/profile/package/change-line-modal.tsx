import CommonModal from "@/components/modal/common-modal";
import ShippingRouteCard from "../../submit/warehouse/shipping-route-card";
import { useTranslations } from "next-intl";

interface ChangeLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  linePre: any[];
  setLinePre: (routes: any[]) => void;
  title?: string;
  currentWaybill?: any;
  selectedRouteId?: string;
}

export default function ChangeLineModal({
  isOpen,
  onClose,
  onConfirm,
  currentWaybill,
  selectedRouteId,
  setSelectedRouteId,
}: any) {
  const t = useTranslations("profile.package");

  return (
    <CommonModal
      isOpen={isOpen}
      title={t("changeTitle")}
      onConfirm={async () => await onConfirm(currentWaybill?.id, selectedRouteId)}
      onOpenChange={onClose}
    >
      <div className="flex flex-col gap-2">
        {currentWaybill?.changePre?.map((line: any) => (
          <ShippingRouteCard
            key={line.id}
            route={line}
            isSelected={line?.id == selectedRouteId}
            onSelect={() => { setSelectedRouteId(line?.id || null) }}
          />
        ))}
      </div>
    </CommonModal>
  );
}
