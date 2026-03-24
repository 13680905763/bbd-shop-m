import React, { useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaTimes,
  FaPlay,
  FaDownload,
} from "react-icons/fa";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export type MediaItem = {
  id: string | number;
  fileUrl: string;
};

type MediaPreviewGroupProps = {
  fileList?: MediaItem[];
  thumbnailSize?: number; // 缩略图大小
};

const MediaPreviewGroup: React.FC<MediaPreviewGroupProps> = ({
  fileList = [],
  thumbnailSize = 30,
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!fileList || fileList.length === 0) return null;

  const isVideo = (url?: string) =>
    url?.match(/\.(mp4|mov|avi|mkv)$/i) !== null;

  const openPreview = (index: number) => {
    if (index < 0 || index >= fileList.length) return;
    setCurrentIndex(index);
    setPreviewVisible(true);
  };

  const prev = () =>
    setCurrentIndex((i) => (i - 1 + fileList.length) % fileList.length);
  const next = () => setCurrentIndex((i) => (i + 1) % fileList.length);

  const currentItem = fileList[currentIndex];

  const downloadFile = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      // 检测是否为 iOS 设备
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as any).MSStream;

      if (isIOS) {
        // iOS Safari 不支持 download 属性，直接打开 blob URL 让用户长按保存或使用分享菜单
        const reader = new FileReader();

        reader.onload = function (e) {
          if (e.target?.result) {
            window.location.href = e.target.result as string;
          }
        };
        reader.readAsDataURL(blob);
      } else {
        // 其他设备使用 createObjectURL 下载
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = blobUrl;
        const fileName = url.split("/").pop() || "download";

        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }
    } catch (error) {
      console.error("Download failed:", error);
      // 降级：直接在新窗口打开 URL
      window.open(url, "_blank");
    }
  };

  const handleDownload = () => {
    if (currentItem?.fileUrl) {
      downloadFile(currentItem.fileUrl);
    }
  };

  const handleDownloadAll = async () => {
    if (!fileList.length) return;

    try {
      const zip = new JSZip();
      const folder = zip.folder("images");
      let successCount = 0;

      // 并行下载所有文件
      const promises = fileList.map(async (item, index) => {
        if (!item.fileUrl) return;
        try {
          const response = await fetch(item.fileUrl);

          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
          const blob = await response.blob();

          if (blob.size > 0) {
            // 获取文件名，如果没有则使用默认名
            const fileName =
              item.fileUrl.split("/").pop()?.split("?")[0] ||
              `image_${index + 1}.jpg`;

            folder?.file(fileName, blob);
            successCount++;
          }
        } catch (err) {
          console.error(`Failed to download ${item.fileUrl}`, err);
        }
      });

      await Promise.all(promises);

      if (successCount === 0) {
        alert(
          "Failed to download images. Please check your network or try again.",
        );

        return;
      }

      // 生成 zip 并下载
      const content = await zip.generateAsync({ type: "blob" });

      saveAs(content, "images.zip");
    } catch (error) {
      console.error("Failed to zip files:", error);
    }
  };

  const renderContent = () => {
    if (!currentItem || !currentItem.fileUrl) return null;

    return isVideo(currentItem.fileUrl) ? (
      <video
        autoPlay
        controls
        muted
        className="-webkit-user-drag-none max-h-[85vh] w-full max-w-full select-none object-contain"
        src={currentItem.fileUrl}
      />
    ) : (
      <img
        alt="preview"
        className="-webkit-user-drag-none max-h-[85vh] w-full max-w-full select-none object-contain"
        src={currentItem.fileUrl}
      />
    );
  };

  return (
    <div className="relative pr-8">
      {fileList.length > 0 && (
        <div
          className="absolute -top-1 right-1 z-10 cursor-pointer text-gray-500 hover:text-primary"
          role="button"
          title="Download All"
          onClick={handleDownloadAll}
        >
          <FaDownload size={16} />
        </div>
      )}
      {/* 缩略图列表 */}
      <div className="flex flex-wrap gap-2">
        {fileList.map((item, idx) => {
          const video = isVideo(item.fileUrl);

          return (
            <button
              key={item?.id ?? idx}
              className="relative flex-shrink-0 cursor-pointer overflow-hidden bg-gray-300"
              style={{
                width: thumbnailSize + "px",
                height: thumbnailSize + "px",
              }}
              onClick={() => openPreview(idx)}
            >
              {video ? (
                <FaPlay className="absolute inset-0 m-auto text-sm text-white" />
              ) : (
                <img
                  alt="thumbnail"
                  className="-webkit-user-drag-none h-full w-full select-none object-cover"
                  src={item.fileUrl}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 弹窗 */}
      {previewVisible && currentItem && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-90 p-4">
          <div className="absolute right-4 top-4 z-50 flex gap-4">
            <FaDownload
              className="cursor-pointer text-2xl text-white hover:text-gray-300"
              onClick={handleDownload}
            />
            <FaTimes
              className="cursor-pointer text-2xl text-white hover:text-gray-300"
              onClick={() => setPreviewVisible(false)}
            />
          </div>

          {/* 内容容器 */}
          <div className="pointer-events-none relative flex w-full max-w-[95vw] flex-1 flex-col items-center justify-center">
            {/* 图片/视频 */}
            <div className="pointer-events-auto flex w-full flex-1 items-center justify-center overflow-hidden">
              {renderContent()}
            </div>

            {/* 左右按钮放在下面 */}
            <div className="pointer-events-auto mt-8 flex gap-12">
              <FaArrowLeft
                className="cursor-pointer text-3xl text-white hover:text-gray-300"
                onClick={prev}
              />
              <FaArrowRight
                className="cursor-pointer text-3xl text-white hover:text-gray-300"
                onClick={next}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPreviewGroup;
