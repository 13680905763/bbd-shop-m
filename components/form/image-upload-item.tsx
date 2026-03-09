import React, { useRef } from "react";
import { Image } from "@heroui/react";
import { IoCloseCircle } from "react-icons/io5";
import { FaCamera } from "react-icons/fa";
import { useTranslations } from "next-intl";

interface ImageItem {
  id: string;
  preview: string;
  file?: File;
  uploading?: boolean;
}

interface ImageUploadItemProps {
  formData: any;
  onChange: (key: string, value: any) => void;
  name: string;
  label?: string;
  maxCount?: number;
  onUpload?: (file: File) => Promise<string>;
}

export default function ImageUploadItem({
  formData,
  onChange,
  name,
  label,
  maxCount = 5,
  onUpload,
}: ImageUploadItemProps) {
  const t = useTranslations("components.form.uploadImages");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ensure imageList is an array
  const imageList: ImageItem[] = Array.isArray(formData[name])
    ? formData[name]
    : [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    const newImages: ImageItem[] = [];
    // Calculate how many more images we can add
    const remainingSlots = maxCount - imageList.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    // Create temporary images for preview
    const tempImages: ImageItem[] = filesToProcess.map((file) => ({
      id: `temp-${Date.now()}-${Math.random()}`,
      preview: URL.createObjectURL(file),
      file: file,
      uploading: true, // Start with uploading state if we have onUpload
    }));

    // Update state with temporary images
    const currentList = [...imageList, ...tempImages];

    onChange(name, currentList);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Process uploads if handler provided
    if (onUpload) {
      tempImages.forEach(async (imgItem) => {
        try {
          if (imgItem.file) {
            const url = await onUpload(imgItem.file);

            // Update the item with the real URL and remove uploading state
            updateImageItem(imgItem.id, {
              preview: url, // Assuming the API returns the URL
              uploading: false,
              // You might want to store the server ID or URL differently depending on your API
              // For now, replacing preview with the result URL
            });
          }
        } catch (error) {
          console.error("Upload failed", error);
          // Handle error - maybe remove the item or show error state
          removeImageById(imgItem.id);
        }
      });
    } else {
      // If no upload handler, just set uploading to false
      const updatedImages = tempImages.map((img) => ({
        ...img,
        uploading: false,
      }));

      // We need to update the state again to reflect 'uploading: false'
      // But since we appended to imageList earlier, we can't easily find them unless we use IDs.
      // Easier way:
      onChange(name, [...imageList, ...updatedImages]);
    }
  };

  const updateImageItem = (id: string, updates: Partial<ImageItem>) => {
    const newList = listRef.current.map((item) =>
      item.id === id ? { ...item, ...updates } : item,
    );

    onChange(name, newList);
  };

  // Ref to track current images for async updates
  const listRef = useRef<ImageItem[]>(imageList);

  // Update ref when prop changes
  listRef.current = imageList;

  const updateImageStatus = (id: string, url: string) => {
    const newList = listRef.current.map((item) =>
      item.id === id ? { ...item, preview: url, uploading: false } : item,
    );

    onChange(name, newList);
  };

  const removeImageById = (id: string) => {
    const newList = listRef.current.filter((item) => item.id !== id);

    onChange(name, newList);
  };

  const handleRemoveImage = (index: number) => {
    const newImageList = [...imageList];

    // Revoke object URL to avoid memory leaks
    if (newImageList[index].preview.startsWith("blob:")) {
      URL.revokeObjectURL(newImageList[index].preview);
    }
    newImageList.splice(index, 1);
    onChange(name, newImageList);
  };

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className="flex w-full flex-col gap-2">
        <div className="flex flex-wrap gap-4">
          {imageList.map((item, index) => (
            <div
              key={item.id}
              className="group relative h-24 w-24 overflow-hidden rounded-xl border"
            >
              <Image
                alt={`preview-${index}`}
                className="h-full w-full object-cover"
                radius="none"
                src={item.preview}
              />
              {item.uploading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}
              <button
                className="absolute right-1 top-1 z-20 cursor-pointer rounded-full bg-white text-red-500 shadow-md transition-colors hover:bg-gray-100"
                type="button"
                onClick={() => handleRemoveImage(index)}
              >
                <IoCloseCircle size={20} />
              </button>
            </div>
          ))}

          {imageList.length < maxCount && (
            <div
              className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 transition-colors hover:border-primary hover:bg-blue-50 hover:text-primary"
              role="button"
              onClick={() => fileInputRef.current?.click()}
            >
              <FaCamera size={24} />
              <span className="mt-1 text-xs font-medium">
                {imageList.length}/{maxCount}
              </span>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500">{t("tip")}</p>
        <input
          ref={fileInputRef}
          hidden
          multiple
          accept="image/*"
          type="file"
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
}
