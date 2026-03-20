"use client";

import { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  Modal,
  ModalContent,
  Textarea,
  Image,
  addToast,
  Avatar,
} from "@heroui/react";
import {
  FaComments,
  FaImage,
  FaTimes,
  FaExpand,
  FaCompress,
  FaShoppingBag,
} from "react-icons/fa";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

import { useChat } from "@/hook/chat/useChat";
import OrderListModal from "./order-list-modal";

export default function ChatBox() {
  const t = useTranslations("components.chatbox");

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // 控制是否展开/全屏
  const [showOrderModal, setShowOrderModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);

  // Use the custom hook
  const {
    messages,
    sendMessage,
    sendImage,
    loadMoreHistory,
    isLoadingHistory,
    firstLoading,
    hasMoreHistory,
    shouldScrollRef,
    hasAgent,
    user,
  } = useChat(isOpen);

  // Handle scroll for history loading
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // If loading or no more history, do nothing
    if (isLoadingHistory || !hasMoreHistory) return;

    const target = e.currentTarget;

    if (target.scrollTop <= 10) {
      const container = scrollContainerRef.current;
      const prevScrollHeight = container?.scrollHeight ?? 0;

      loadMoreHistory().then(() => {
        // Restore scroll position after DOM update
        requestAnimationFrame(() => {
          if (container) {
            const newScrollHeight = container.scrollHeight;
            const diff = newScrollHeight - prevScrollHeight;

            if (diff > 0) {
              container.scrollTop = diff;
            }
          }
        });
      });
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (shouldScrollRef.current) {
      const container = scrollContainerRef.current;

      if (container) {
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight;
        });
      }
      shouldScrollRef.current = false;
    }
  }, [messages, shouldScrollRef]);

  const handleSend = () => {
    const msgText = input.trim();
    if (!msgText) return;
    sendMessage(msgText, "TEXT");
    setInput("");
  };

  const insertEmoji = (emoji: string) => {
    if (!textareaRef.current) {
      setInput((prev) => prev + emoji);
      return;
    }
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = input.substring(0, start) + emoji + input.substring(end);

    setInput(newValue);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
      textarea.focus();
    }, 0);
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (e.g., 5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      addToast({ title: t("imageTooLarge", { defaultMessage: "Image size cannot exceed 5MB" }), color: "danger" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    sendImage(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <motion.div
        drag
        className="fixed bottom-6 right-6 z-50"
        dragMomentum={false}
        onDragEnd={() => setTimeout(() => (isDraggingRef.current = false), 100)}
        onDragStart={() => (isDraggingRef.current = true)}
      >
        <Button
          isIconOnly
          className="w-10 h-10 shadow-lg"
          color="primary"
          radius="full"
          onPress={() => {
            if (isDraggingRef.current) return;
            if (!user?.id) {
              addToast({
                title: t("loginFirst"),
                timeout: 1000,
                color: "danger",
              });
              return;
            }
            setIsOpen(true);
          }}
        >
          <FaComments className="w-6 h-6" />
        </Button>
      </motion.div>

      <Modal
        // className={"!fixed bottom-20 right-6 !m-0"}
        size={'full'}
        placement='center'
        backdrop="opaque"
        radius="none"
        scrollBehavior='inside'
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <ModalContent
          className={`p-0 m-0 fixed  overflow-hidden transition-all duration-300 `}
        >
          <Card className="flex h-full w-full flex-col"  radius="none">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4  text-white">
              <div className="flex items-center gap-2">
                <img alt="logo" className="w-15 h-6 rounded " src="/m/logo.png" />
                <span className="text-sm font-semibold text-[#f0700c]">
                  {t("onlineSupport")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#f0700c]">
                <button
                  className="rounded p-1 hover:bg-white/20 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div
              ref={scrollContainerRef}
              className="flex-1 space-y-2 overflow-y-auto bg-gray-50 p-3"
              onScroll={handleScroll}
            >
              {firstLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-50/70">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
                </div>
              )}
              {isLoadingHistory && !firstLoading && (
                <div className="flex justify-center py-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 w-full ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {msg.sender === "bot" ? (
                      <Avatar src="/logo.png" size="sm" className="bg-white border p-1" />
                    ) : (
                      <Avatar src={user?.avatarUrl || ""} name={user?.nickname?.[0] || "U"} size="sm" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`w-fit max-w-[75%] break-words rounded-lg p-2 ${msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                      }`}
                  >
                    <div className="flex flex-col gap-1">
                      {msg.type === "IMAGE" && msg.text ? (
                        <div className="relative inline-block">
                          <Image
                            alt="image"
                            className="max-w-[200px] max-h-[200px] object-contain rounded"
                            src={msg.text}
                          />
                          {msg.sending && (
                            <div className="absolute inset-0 flex items-center justify-center rounded bg-black/20">
                              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            </div>
                          )}
                        </div>
                      ) : msg.type === "ORDER" ? (
                        <div className="rounded bg-orange-100 p-2 font-mono text-sm text-black w-full">
                          {(() => {
                            try {
                              const order = JSON.parse(msg.text || "{}");
                              return (
                                <div className="flex flex-col gap-2">
                                  <div className="font-semibold border-b border-yellow-200 pb-1">
                                    {t("orderNo")}{order.orderCode}
                                  </div>
                                  <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                                    {order.products?.map((product: any, idx: number) => (
                                      <div key={idx} className="flex gap-2 items-start">
                                        <Image
                                          src={product.picUrl}
                                          alt="product"
                                          className="w-12 h-12 object-cover rounded shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <div className="text-xs line-clamp-2 leading-tight">
                                            {product.productTitle}
                                          </div>
                                          <div className="text-xs text-gray-500 mt-1">
                                            {t("price")}{product.price} x {product.quantity}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            } catch (e) {
                              return <div>{msg.text}</div>;
                            }
                          })()}
                        </div>
                      ) : (
                        msg.text
                      )}
                      <span
                        className={`text-[10px] self-end ${msg.sender === "user" ? "text-blue-100" : "text-gray-500"
                          }`}
                      >
                        {(msg?.createTime)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative flex flex-col gap-2 border-t bg-white p-3">
              <Textarea
                ref={textareaRef}
                classNames={{
                  inputWrapper:
                    "w-full border border-gray-300 rounded-md px-3 py-2",
                  input: "text-base",
                }}
                placeholder={t("inputPlaceholder")}
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />

              {showEmojiPicker && (
                <div className="absolute bottom-20 left-3 z-50">
                  <Picker
                    data={data}
                    theme="light"
                    onEmojiSelect={(e: any) => insertEmoji(e.native)}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    className="flex h-8 w-8 items-center justify-center"
                    color="primary"
                    radius="full"
                    variant="light"
                    onPress={() => setShowEmojiPicker((prev) => !prev)}
                  >
                    😀
                  </Button>
                  <Button
                    className="flex h-8 w-8 items-center justify-center"
                    color="primary"
                    radius="full"
                    variant="light"
                    onPress={() => fileInputRef.current?.click()}
                  >
                    <FaImage />
                  </Button>
                  <Button
                    className="flex h-8 w-8 items-center justify-center"
                    color="primary"
                    radius="full"
                    variant="light"
                    onPress={() => setShowOrderModal(true)}
                  >
                    <FaShoppingBag />
                  </Button>
                </div>

                <Button
                  className="px-4 py-2"
                  color="primary"
                  onPress={handleSend}
                >
                  {t("send")}
                </Button>

                <input
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </Card>
        </ModalContent>
      </Modal>
      {showOrderModal && (
        <OrderListModal
          isOpen={showOrderModal}
          onClose={() => setShowOrderModal(false)}
          onSendOrder={(order) => {
            sendMessage(JSON.stringify(order), "ORDER");
            setShowOrderModal(false);
          }}
        />
      )}
    </>
  );
}
