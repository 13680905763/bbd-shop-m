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
  Badge,
} from "@heroui/react";
import { FaComments, FaImage, FaTimes, FaShoppingBag, FaBoxOpen } from "react-icons/fa";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

import OrderListModal from "./order-list-modal";

import { useChat } from "@/hook/business/useChat";
import { useChatStore, useGlobalStore } from "@/store";
import WaybillListModal from "./chat-waybill";
import { useVisualViewport } from "@/hook/common";

export default function ChatBox() {
  const t = useTranslations("components.chatbox");
  const { currency } = useGlobalStore();

  const { isOpen, setIsOpen, pendingOrder, setPendingOrder, pendingWaybill, setPendingWaybill } = useChatStore();

  useVisualViewport();

  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showWaybillModal, setShowWaybillModal] = useState(false);

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

  // Handle pending order from store
  useEffect(() => {
    if (isOpen && pendingOrder && user?.id && !firstLoading) {
      // Delay to ensure websocket is ready and messages are loaded
      const timer = setTimeout(() => {
        const orderWithCurrency = {
          ...pendingOrder,
          products: pendingOrder.products?.map((p: any) => ({
            ...p,
            price: `${currency.symbol}${p.price}`
          }))
        };

        // Try to send, if it returns true (success), clear the pending order
        const success = sendMessage(JSON.stringify(orderWithCurrency), "ORDER");
        if (success) {
          setPendingOrder(null);
        }
      }, 1000); // Increased delay to ensure connection is stable
      return () => clearTimeout(timer);
    }
  }, [isOpen, pendingOrder, user?.id, sendMessage, setPendingOrder, currency.symbol, firstLoading]);

  // Handle pending waybill from store
  useEffect(() => {
    if (isOpen && pendingWaybill && user?.id && !firstLoading) {
      // Delay to ensure websocket is ready and messages are loaded
      const timer = setTimeout(() => {
        // Try to send, if it returns true (success), clear the pending waybill
        const success = sendMessage(JSON.stringify(pendingWaybill), "WAYBILL");
        if (success) {
          setPendingWaybill(null);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, pendingWaybill, user?.id, sendMessage, setPendingWaybill, firstLoading]);

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

  // Handle visual viewport height changes (e.g. keyboard appearing)
  useEffect(() => {
    if (isOpen) {
      const handleResize = () => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
      };

      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", handleResize);

        return () => window.visualViewport?.removeEventListener("resize", handleResize);
      }
    }
  }, [isOpen]);

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
      addToast({
        title: t("imageTooLarge", {
          defaultMessage: "Image size cannot exceed 5MB",
        }),
        color: "danger",
      });
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
        <Badge
          content={user?.msgCount > 99 ? "99+" : user?.msgCount}
          isInvisible={!user?.msgCount || user.msgCount === 0}
          color="primary"
          shape="circle"
        >
          <Button
            isIconOnly
            className="h-10 w-10 shadow-lg"
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
            <FaComments className="h-6 w-6" />
          </Button>
        </Badge>
      </motion.div>

      <Modal
        // className={"!fixed bottom-20 right-6 !m-0"}
        backdrop="opaque"
        isOpen={isOpen}
        placement="center"
        radius="none"
        scrollBehavior="inside"
        size={"full"}
        onOpenChange={setIsOpen}
      >
        <ModalContent
          className={`fixed m-0 overflow-hidden p-0 transition-all duration-300`}
          style={{
            height: "var(--visual-viewport-height, 100vh)",
          }}
        >
          <Card
            className="flex h-full w-full flex-col"
            radius="none"
            style={{
              height: "100%",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 text-white">
              <div className="flex items-center gap-2">
                <img
                  alt="logo"
                  className="w-15 h-6 rounded"
                  src="/m/logo.png"
                />
                <span className="text-sm font-semibold text-[#f0700c]">
                  {t("onlineSupport")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#f0700c]">
                <button
                  className="rounded p-1 transition-colors hover:bg-white/20"
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
                  className={`flex w-full gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {msg.sender === "bot" ? (
                      <Avatar
                        className="border bg-white p-1"
                        size="sm"
                        src="/m/logo.png"
                      />
                    ) : (
                      <Avatar
                        name={user?.nickname?.[0] || "U"}
                        size="sm"
                        src={user?.avatarUrl || ""}
                      />
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
                            className="max-h-[200px] max-w-[200px] rounded object-contain"
                            src={msg.text}
                          />
                          {msg.sending && (
                            <div className="absolute inset-0 flex items-center justify-center rounded bg-black/20">
                              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            </div>
                          )}
                        </div>
                      ) : msg.type === "ORDER" ? (
                        <div className="w-full rounded bg-orange-100 p-2 font-mono text-sm text-black">
                          {(() => {
                            try {
                              const order = JSON.parse(msg.text || "{}");

                              return (
                                <div className="flex flex-col gap-2">
                                  <div className="border-b border-yellow-200 pb-1 font-semibold">
                                    {t("orderNo")}
                                    {order.orderCode}
                                  </div>
                                  <div className="flex max-h-40 flex-col gap-2 overflow-y-auto">
                                    {order.products?.map(
                                      (product: any, idx: number) => (
                                        <div
                                          key={idx}
                                          className="flex items-start gap-2"
                                        >
                                          <Image
                                            alt="product"
                                            className="h-10 w-10 flex-shrink-0 rounded object-cover"
                                            referrerPolicy="no-referrer"
                                            src={
                                              product.skuPicUrl ||
                                              product.picUrl
                                            }
                                          />
                                          <div className="flex-1 text-xs">
                                            <div className="line-clamp-2">
                                              {product.productTitle}
                                            </div>
                                            <div className="mt-1 text-gray-500">
                                              {t("price")}
                                              {product.price} x{" "}
                                              {product.quantity}
                                            </div>
                                          </div>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </div>
                              );
                            } catch (e) {
                              return <div>{msg.text}</div>;
                            }
                          })()}
                        </div>
                      ) : msg.type === "WAYBILL" ? (
                        <div className="rounded bg-blue-100 p-2 font-mono text-sm text-black w-full">
                          {(() => {
                            try {
                              const waybill = JSON.parse(msg.text || "{}");
                              return (
                                <div className="flex flex-col gap-2">
                                  <div className="font-semibold border-b border-blue-200 pb-1">
                                    {t("waybillNo", { defaultMessage: "Waybill No: " })}{waybill.packingPackageCode}
                                  </div>
                                  <div className="flex flex-col gap-1 text-xs">
                                    {waybill.shippingCode && (
                                      <div>
                                        <span className="text-gray-500">{t("trackingNo", { defaultMessage: "Tracking No: " })}</span>
                                        {waybill.shippingCode}
                                      </div>
                                    )}
                                    {waybill.pic && waybill.pic.length > 0 && (
                                      <div className="flex gap-2 mt-1 overflow-x-auto no-scrollbar flex-wrap">
                                        {waybill.pic.map((url: string, index: number) => (
                                          <Image
                                            key={index}
                                            src={url}
                                            referrerPolicy="no-referrer"
                                            alt="waybill pic"
                                            className="w-12 h-12 object-cover rounded flex-shrink-0"
                                          />
                                        ))}
                                      </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-1 mt-1">
                                      <div>
                                        <span className="text-gray-500">{t("weight", { defaultMessage: "Weight" })}: </span>
                                        {waybill.weight}g
                                      </div>
                                      <div>
                                        <span className="text-gray-500">{t("size", { defaultMessage: "Size" })}: </span>
                                        {waybill.length}*{waybill.width}*{waybill.height}cm
                                      </div>
                                    </div>
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
                        className={`self-end text-[10px] ${msg.sender === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                          }`}
                      >
                        {msg?.createTime}
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
                <div className="flex items-center  flex-1">
                  <Button
                    className="flex  items-center justify-center"
                    color="primary"
                    isIconOnly={true}
                    radius="full"
                    variant="light"
                    onPress={() => setShowEmojiPicker((prev) => !prev)}
                  >
                    😀
                  </Button>
                  <Button
                    className="flex items-center justify-center"
                    color="primary"
                    radius="full"
                    isIconOnly={true}

                    variant="light"
                    onPress={() => fileInputRef.current?.click()}
                  >
                    <FaImage />
                  </Button>
                  <Button
                    className="flex  items-center justify-center"
                    color="primary"
                    radius="full"
                    isIconOnly={true}

                    variant="light"
                    onPress={() => setShowOrderModal(true)}
                  >
                    <FaShoppingBag />
                  </Button>
                  <Button
                    className="flex  items-center justify-center"
                    color="primary"
                    isIconOnly={true}

                    radius="full"
                    variant="light"
                    onPress={() => setShowWaybillModal(true)}
                  >
                    <FaBoxOpen />
                  </Button>
                </div>

                <Button
                  className="px-4 py-2 flex-1 "
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
            const orderWithCurrency = {
              ...order,
              products: order.products?.map((p: any) => ({
                ...p,
                price: `${currency.symbol}${p.price}`,
              })),
            };

            sendMessage(JSON.stringify(orderWithCurrency), "ORDER");
            setShowOrderModal(false);
          }}
        />
      )}
      {showWaybillModal && (
        <WaybillListModal
          isOpen={showWaybillModal}
          onClose={() => setShowWaybillModal(false)}
          onSendWaybill={(waybill) => {
            sendMessage(JSON.stringify(waybill), "WAYBILL");
            setShowWaybillModal(false);
          }}
        />
      )}
    </>
  );
}
