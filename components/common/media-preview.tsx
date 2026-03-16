import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaTimes, FaPlay, FaDownload } from "react-icons/fa";

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
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const fileName = url.split("/").pop() || "download";
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
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
    // 循环下载所有文件
    for (const item of fileList) {
      if (item.fileUrl) {
        await downloadFile(item.fileUrl);
        // 稍微延迟一下，避免浏览器请求过于频繁导致丢失或拦截
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
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
          title="Download All"
          role="button"
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
          <div className="absolute right-4 top-4 flex gap-4 z-50">
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
          <div className="relative flex w-full max-w-[95vw] flex-1 flex-col items-center justify-center pointer-events-none">
            {/* 图片/视频 */}
            <div className="flex w-full flex-1 items-center justify-center overflow-hidden pointer-events-auto">
              {renderContent()}
            </div>
            
            {/* 左右按钮放在下面 */}
            <div className="mt-8 flex gap-12 pointer-events-auto">
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
