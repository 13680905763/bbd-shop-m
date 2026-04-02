import { addToast, Button } from "@heroui/react";
import { FaDownload } from "react-icons/fa";
import { useTranslations } from "next-intl";
import JSZip from "jszip";
import MediaPreviewGroup, { MediaItem } from "@/components/common/media-preview";

export const downloadServicesImages = async (
  services: any[],
  zipName: string
) => {
  if (!services || services.length === 0) return;

  try {
    const zip = new JSZip();
    const folderName = zipName.replace(/\.zip$/i, "");
    const folder = zip.folder(folderName);
    let successCount = 0;

    const promises = services.flatMap((service) => {
      const fileList = (service.fileList || []) as MediaItem[];
      return fileList.map(async (item, index) => {
        if (!item.fileUrl) return;
        try {
          const response = await fetch(item.fileUrl, { cache: "no-store" });
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const blob = await response.blob();

          if (blob.size > 0) {
            const ext = item.fileUrl.split(".").pop()?.split("?")[0] || "jpg";
            const imgPre = service.serviceName;
            const fileName = imgPre ? `${imgPre}_${index + 1}.${ext}` : `image_${index + 1}.${ext}`;
            folder?.file(fileName, blob);
            successCount++;
          }
        } catch (err) {
          console.error(`Failed to download ${item.fileUrl}`, err);
        }
      });
    });

    await Promise.all(promises);

    if (successCount === 0) {
      alert("Failed to download images. Please check your network or try again.");
      return;
    }

    const content = await zip.generateAsync({ type: "blob" });
    const blobUrl = window.URL.createObjectURL(content);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = zipName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 2000);
  } catch (error) {
    console.error("Failed to zip files:", error);
  }
};

type AdditionalServicesGroupProps = {
  services?: any[];
  prefix?: string;
};

export default function AdditionalServicesGroup({
  services,
  prefix,
}: AdditionalServicesGroupProps) {
  const t = useTranslations("components.common");
  const title = t("additionalServices");
  if (!services || services.length === 0) return null;

  const handleDownloadAllService = async () => {
    const hasImages = services.some(
      (s: any) => s.fileList && Array.isArray(s.fileList) && s.fileList.length > 0
    );

    if (!hasImages) {
      addToast({ title: t("noImagesToDownload"), color: "danger" });
      return;
    }

    const zipName = `${prefix}_${title}.zip`;
    await downloadServicesImages(services, zipName);
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-[#fafafa] p-2">
      <div className="flex items-center justify-between pb-1 border-b border-gray-100">
        <span className="text-xs font-semibold text-gray-600">
          {title}
        </span>
        <Button
          variant="light"
          size="sm"
          isIconOnly
          className="text-gray-500 min-w-0 w-6 h-6 px-0"
          onPress={handleDownloadAllService}
        >
          <FaDownload size={14} />
        </Button>
      </div>
      {services.map((service: any) => (
        <div key={service.id || service.serviceId} className="flex flex-col gap-1.5 pt-1">
          <div className="text-sm text-[#acacac]">
            {service.serviceName}
            {service.quantity ? ` * ${service.quantity}` : ""}
          </div>
          <MediaPreviewGroup
            fileList={service.fileList as MediaItem[]}
          />
        </div>
      ))}
    </div>
  );
}
