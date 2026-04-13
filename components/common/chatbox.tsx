"use client";

import { useState, useEffect, useRef, useContext } from "react";
import {
  Button,
  Textarea,
  Image,
  addToast,
  Avatar,
  Badge,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@heroui/react";
import {
  FaComments,
  FaImage,
  FaShoppingBag,
  FaBoxOpen,
  FaBars,
  FaHistory,
  FaRegListAlt,
  FaBox,
  FaTruck,
  FaTrash,
} from "react-icons/fa";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

import OrderListModal from "./order-list-modal";
import WaybillListModal from "./chat-waybill";

import { ConfirmContext } from "@/components/common";
import {
  useChat,
  useChatContextList,
  useDeleteChatContext,
} from "@/hook/business/useChat";
import { useChatStore, useGlobalStore } from "@/store";

export default function ChatBox() {
  const t = useTranslations("components.chatbox");
  const { currency } = useGlobalStore();
  const confirmContext = useContext(ConfirmContext);

  const {
    isOpen,
    setIsOpen,
    pendingOrder,
    setPendingOrder,
    pendingWaybill,
    setPendingWaybill,
    chatMode,
    activeBizCode,
    resetToCommon,
    setChatMode,
    setActiveBizCode,
  } = useChatStore();

  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showWaybillModal, setShowWaybillModal] = useState(false);
  const [showContextDrawer, setShowContextDrawer] = useState(false);
  const [deletingBizCode, setDeletingBizCode] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);

  // 1. 定义 Ref
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Use the custom hook
  const {
    messages,
    sendOrder,
    sendWaybill,
    sendMessage,
    sendImage,
    loadMoreHistory,
    isLoadingHistory,
    firstLoading,
    hasMoreHistory,
    shouldScrollRef,
    user,
  } = useChat(isOpen, activeBizCode);
  const { data: contextList = [], isLoading: loadingContexts } =
    useChatContextList(user?.id || "");
  const { mutate: removeChatContext, isPending: deletingContext } =
    useDeleteChatContext();

  useEffect(() => {
    if (isOpen && pendingOrder && user?.id && !firstLoading) {
      // Delay to ensure websocket is ready and messages are loaded
      const timer = setTimeout(() => {
        const orderWithCurrency = {
          ...pendingOrder,
          products: pendingOrder.products?.map((p: any) => ({
            ...p,
            price: `${currency.symbol}${p.price}`,
          })),
        };

        const success = sendOrder(
          JSON.stringify(orderWithCurrency),
          pendingOrder.orderCode,
        );

        if (success) {
          setPendingOrder(null);
        }
      }, 1000); // Increased delay to ensure connection is stable

      return () => clearTimeout(timer);
    }
  }, [
    isOpen,
    pendingOrder,
    user?.id,
    sendOrder,
    setPendingOrder,
    currency.symbol,
    firstLoading,
  ]);

  useEffect(() => {
    if (isOpen && pendingWaybill && user?.id && !firstLoading) {
      // Delay to ensure websocket is ready and messages are loaded
      const timer = setTimeout(() => {
        const success = sendWaybill(
          JSON.stringify(pendingWaybill),
          pendingWaybill.packingPackageCode,
        );

        if (success) {
          setPendingWaybill(null);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [
    isOpen,
    pendingWaybill,
    user?.id,
    sendWaybill,
    setPendingWaybill,
    firstLoading,
  ]);

  useEffect(() => {
    if (!isOpen) {
      setShowContextDrawer(false);
    }
  }, [isOpen]);

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

  const scrollToBottom = () => {
    // block: "end" 会强制将该元素对齐到滚动容器的底部
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  useEffect(() => {
    if (isOpen) {
      const viewport = window.visualViewport;
      const handleResize = () => {
        setTimeout(scrollToBottom, 250); // 等键盘弹完
      };

      viewport?.addEventListener("resize", handleResize);

      return () => viewport?.removeEventListener("resize", handleResize);
    }
  }, [isOpen]);

  const handleSend = () => {
    const msgText = input.trim();

    if (!msgText) return;
    sendMessage(msgText, "TEXT", activeBizCode || undefined);
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

    sendImage(file, activeBizCode || undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const deleteContext = (bizCode: string) => {
    setDeletingBizCode(bizCode);
    removeChatContext(bizCode, {
      onSuccess: () => {
        if (activeBizCode === bizCode) {
          resetToCommon();
        }
        setDeletingBizCode(null);
      },
      onError: () => {
        setDeletingBizCode(null);
        addToast({
          title: t("deleteFailed", {
            defaultMessage: "Failed to delete record",
          }),
          color: "danger",
        });
      },
    });
  };

  const confirmDeleteContext = async (ctx: any) => {
    if (!confirmContext) {
      deleteContext(ctx.bizCode);
      return;
    }

    const confirmed = await confirmContext.confirm({
      title: t("deleteConfirmTitle", {
        defaultMessage: "Delete consultation record",
      }),
      content: t("deleteConfirmContent", {
        defaultMessage:
          "Are you sure you want to delete this consultation record? This action cannot be undone.",
      }),
      confirmText: t("deleteConfirmButton", {
        defaultMessage: "Delete",
      }),
      cancelText: t("cancelDelete", {
        defaultMessage: "Cancel",
      }),
      onConfirm: () => deleteContext(ctx.bizCode),
    });

    if (!confirmed) {
      setDeletingBizCode(null);
    }
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
          color="primary"
          content={user?.msgCount > 99 ? "99+" : user?.msgCount}
          isInvisible={!user?.msgCount || user.msgCount === 0}
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

      <Drawer
        backdrop="opaque"
        isOpen={isOpen}
        radius="none"
        scrollBehavior="inside"
        size={"full"}
        onOpenChange={setIsOpen}
      >
        <DrawerContent
          style={{
            // 强制让容器高度等于“露出来的视口高度”
            // 这样底部输入框才会被顶上去，而不是被盖住
            height: window.visualViewport
              ? `${window.visualViewport.height}px`
              : "100dvh",
            maxHeight: "100dvh",
            transition: "height 0.2s ease-out", // 增加平滑过渡
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 text-white">
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                className="h-9 w-9 min-w-9 rounded-full bg-[#f0700c]/10 text-[#f0700c]"
                variant="light"
                onPress={() => setShowContextDrawer(true)}
              >
                <FaBars className="h-4 w-4" />
              </Button>
              <Image
                alt="logo"
                className="w-15 h-6 rounded"
                src="/m/logo.png"
              />
              <span className="text-sm font-semibold text-[#f0700c]">
                {chatMode === "ORDER"
                  ? `${t("orderNo")} ${activeBizCode}`
                  : chatMode === "WAYBILL"
                    ? `${t("waybillNo")} ${activeBizCode}`
                    : t("onlineSupport")}
              </span>
            </div>
          </div>

          <Drawer
            backdrop="blur"
            isOpen={showContextDrawer}
            placement="left"
            size="xs"
            onOpenChange={setShowContextDrawer}
          >
            <DrawerContent>
              <DrawerHeader className="flex items-center gap-2 border-b bg-white px-4 py-4 font-bold text-gray-800 shadow-sm">
                <FaHistory className="text-[#f0700c]" />
                {t("consultationList", {
                  defaultMessage: "Business Consultations",
                })}
              </DrawerHeader>
              <DrawerBody className="bg-gray-50/50 p-3">
                {loadingContexts ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#f0700c]/20 border-t-[#f0700c]" />
                    <span className="text-xs font-medium italic text-gray-400">
                      Loading records...
                    </span>
                  </div>
                ) : contextList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-20 text-gray-300">
                    <FaRegListAlt className="h-14 w-14" />
                    <span className="text-sm font-medium">
                      {t("noConsultations", { defaultMessage: "No records" })}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {contextList?.map((ctx: any) => {
                      const isActive = activeBizCode === ctx.bizCode;
                      const isDeleting = deletingBizCode === ctx.bizCode;

                      return (
                        <div
                          key={ctx.id}
                          className={`group relative flex w-full flex-col overflow-hidden rounded-2xl border p-4 transition-all duration-300 ${
                            isActive
                              ? "scale-[1.01] border-[#f0700c]/30 bg-white shadow-lg ring-1 ring-[#f0700c]/10"
                              : "border-transparent bg-white shadow-sm hover:-translate-y-1 hover:scale-[1.01] hover:border-gray-200 hover:shadow-md active:scale-[0.99]"
                          }`}
                        >
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#f0700c]/0 via-[#f0700c]/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <button
                            aria-label={`Select ${ctx.title}`}
                            className="absolute inset-0 h-full w-full rounded-2xl"
                            onClick={() => {
                              if (isActive) {
                                resetToCommon();
                              } else {
                                setChatMode(
                                  ctx.type === 1 ? "ORDER" : "WAYBILL",
                                );
                                setActiveBizCode(ctx.bizCode);
                              }
                              setShowContextDrawer(false);
                            }}
                          />

                          <div className="pointer-events-none z-10 mb-2 block w-full">
                            <span
                              className={`block truncate text-sm font-bold transition-colors ${
                                isActive ? "text-[#f0700c]" : "text-gray-800"
                              }`}
                              title={ctx.title}
                            >
                              {ctx.title}
                            </span>
                          </div>

                          <div className="pointer-events-none z-10 flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                                isActive
                                  ? "bg-[#f0700c] text-white shadow-lg shadow-[#f0700c]/30"
                                  : "bg-gray-50 text-gray-400 group-hover:bg-[#f0700c]/5 group-hover:text-[#f0700c]"
                              }`}
                            >
                              {ctx.type === 1 ? (
                                <FaBox className="h-4 w-4" />
                              ) : (
                                <FaTruck className="h-4 w-4" />
                              )}
                            </div>

                            <div className="flex flex-col gap-1 truncate">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                                    isActive
                                      ? "bg-[#f0700c]/10 text-[#f0700c]"
                                      : "bg-gray-100 text-gray-500"
                                  }`}
                                >
                                  {ctx.type === 1 ? t("order") : t("waybill")}
                                </span>
                              </div>
                              <span className="truncate text-xs text-gray-400">
                                {ctx.bizCode}
                              </span>
                            </div>

                            <div className="flex-1" />
                            <button
                              className="pointer-events-auto relative z-20 flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-gray-300 opacity-100 shadow-sm transition-all duration-200 hover:scale-110 hover:border-red-100 hover:bg-red-50 hover:text-red-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                              disabled={deletingContext}
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDeleteContext(ctx);
                              }}
                            >
                              {isDeleting ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              ) : (
                                <FaTrash className="h-4 w-4" />
                              )}
                            </button>
                          </div>

                          {isActive && (
                            <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-[#f0700c]" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </DrawerBody>
            </DrawerContent>
          </Drawer>

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
                className={`flex w-full gap-2 ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
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
                  className={`w-fit max-w-[75%] break-words rounded-lg p-2 ${
                    msg.sender === "user"
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
                        {msg.failed && !msg.sending && (
                          <div className="absolute inset-x-2 bottom-2 rounded bg-red-500/85 px-2 py-1 text-center text-xs text-white">
                            {t("imageSendFail")}
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
                                            product.skuPicUrl || product.picUrl
                                          }
                                        />
                                        <div className="flex-1 text-xs">
                                          <div className="line-clamp-2">
                                            {product.productTitle}
                                          </div>
                                          <div className="mt-1 text-gray-500">
                                            {t("price")}
                                            {product.price} x {product.quantity}
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
                      <div className="w-full rounded bg-blue-100 p-2 font-mono text-sm text-black">
                        {(() => {
                          try {
                            const waybill = JSON.parse(msg.text || "{}");

                            return (
                              <div className="flex flex-col gap-2">
                                <div className="border-b border-blue-200 pb-1 font-semibold">
                                  {t("waybillNo", {
                                    defaultMessage: "Waybill No: ",
                                  })}
                                  {waybill.packingPackageCode}
                                </div>
                                <div className="flex flex-col gap-1 text-xs">
                                  {waybill.shippingCode && (
                                    <div>
                                      <span className="text-gray-500">
                                        {t("trackingNo", {
                                          defaultMessage: "Tracking No: ",
                                        })}
                                      </span>
                                      {waybill.shippingCode}
                                    </div>
                                  )}
                                  {waybill.pic && waybill.pic.length > 0 && (
                                    <div className="no-scrollbar mt-1 flex flex-wrap gap-2 overflow-x-auto">
                                      {waybill.pic.map(
                                        (url: string, index: number) => (
                                          <Image
                                            key={index}
                                            alt="waybill pic"
                                            className="h-12 w-12 flex-shrink-0 rounded object-cover"
                                            referrerPolicy="no-referrer"
                                            src={url}
                                          />
                                        ),
                                      )}
                                    </div>
                                  )}
                                  <div className="mt-1 grid grid-cols-2 gap-1">
                                    <div>
                                      <span className="text-gray-500">
                                        {t("weight", {
                                          defaultMessage: "Weight",
                                        })}
                                        :{" "}
                                      </span>
                                      {waybill.weight}g
                                    </div>
                                    <div>
                                      <span className="text-gray-500">
                                        {t("size", { defaultMessage: "Size" })}
                                        :{" "}
                                      </span>
                                      {waybill.length}*{waybill.width}*
                                      {waybill.height}cm
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
                    <div className="flex items-center self-end text-[10px]">
                      {msg.sending ? (
                        <div
                          className={`h-3 w-3 animate-spin rounded-full border border-t-transparent ${
                            msg.sender === "user"
                              ? "border-blue-100"
                              : "border-gray-400"
                          }`}
                        />
                      ) : (
                        !!(msg?.sendTime || msg?.createTime) && (
                          <span
                            className={
                              msg.sender === "user"
                                ? "text-blue-100"
                                : "text-gray-500"
                            }
                          >
                            {msg?.sendTime || msg?.createTime}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
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
              onFocus={() => {
                setTimeout(() => {
                  messagesEndRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                  });
                }, 500);
              }}
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
              <div className="flex flex-1 items-center">
                <Button
                  className="flex items-center justify-center"
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
                  isIconOnly={true}
                  radius="full"
                  variant="light"
                  onPress={() => fileInputRef.current?.click()}
                >
                  <FaImage />
                </Button>
                {!activeBizCode && (
                  <>
                    <Button
                      className="flex items-center justify-center"
                      color="primary"
                      isIconOnly={true}
                      radius="full"
                      variant="light"
                      onPress={() => setShowOrderModal(true)}
                    >
                      <FaShoppingBag />
                    </Button>
                    <Button
                      className="flex items-center justify-center"
                      color="primary"
                      isIconOnly={true}
                      radius="full"
                      variant="light"
                      onPress={() => setShowWaybillModal(true)}
                    >
                      <FaBoxOpen />
                    </Button>
                  </>
                )}
              </div>

              <Button
                className="flex-1 px-4 py-2"
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
        </DrawerContent>
      </Drawer>
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
