import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaTimes, FaPlay } from "react-icons/fa";

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

  const renderContent = () => {
    if (!currentItem || !currentItem.fileUrl) return null;

    return isVideo(currentItem.fileUrl) ? (
      <video
        autoPlay
        controls
        muted
        className="-webkit-user-drag-none max-h-[70vh] max-w-[70vw] select-none object-contain"
        src={currentItem.fileUrl}
      />
    ) : (
      <img
        alt="preview"
        className="-webkit-user-drag-none max-h-[70vh] max-w-[70vw] select-none object-contain"
        src={currentItem.fileUrl}
      />
    );
  };

  return (
    <div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
          <FaTimes
            className="absolute right-4 top-4 cursor-pointer text-2xl text-white"
            onClick={() => setPreviewVisible(false)}
          />

          {/* 内容容器 */}
          <div className="relative inline-flex items-center">
            {/* 左右按钮贴内容两边 */}
            <FaArrowLeft
              className="absolute left-[-50px] cursor-pointer text-3xl text-white"
              onClick={prev}
            />
            <FaArrowRight
              className="absolute right-[-50px] cursor-pointer text-3xl text-white"
              onClick={next}
            />

            {/* 图片/视频 */}
            <div className="flex items-center justify-center">
              {renderContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPreviewGroup;
