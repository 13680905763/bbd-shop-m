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
} from "@heroui/react";
import { FaComments, FaImage, FaTimes } from "react-icons/fa";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

import { useChat } from "@/hook/chat/useChat";
import { useUserInfo } from "@/hook/business";

export default function ChatBox() {
  const t = useTranslations("components.chatbox");
  const { data: user, isLoading, error } = useUserInfo();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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
  } = useChat(user, isOpen);

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
        // Note: This relies on React updating DOM quickly or before this frame.
        // A better way might be useLayoutEffect but this is a simple port.
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
    if (!user?.id) {
      addToast({ title: t("loginFirst"), timeout: 1000, color: "danger" });

      return;
    }
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
    if (!user?.id) {
      addToast({ title: t("loginFirst"), timeout: 1000, color: "danger" });

      return;
    }
    const file = e.target.files?.[0];

    if (!file) return;
    sendImage(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <motion.div
        drag
        className="fixed bottom-24 right-6 z-50"
        dragMomentum={false}
        onDragEnd={() => setTimeout(() => (isDraggingRef.current = false), 100)}
        onDragStart={() => (isDraggingRef.current = true)}
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
      </motion.div>

      <Modal
        backdrop="transparent"
        className="!m-0"
        isOpen={isOpen}
        placement="bottom"
        onOpenChange={setIsOpen}
      >
        <ModalContent className="m-0 h-[100dvh] w-full max-w-[380px] overflow-hidden p-0 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] shadow-xl">
          <Card className="flex h-full w-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-2">
                <img
                  alt="logo"
                  className="w-15 h-6 rounded"
                  src="/m/logo.png"
                />
                <span className="text-sm font-semibold">
                  {t("onlineSupport")}
                </span>
              </div>
              <button
                className="rounded p-1 hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            {/* Messages Area */}
            <div
              ref={scrollContainerRef}
              className="flex-1 space-y-2 overflow-y-auto bg-gray-50 p-3"
              onScroll={handleScroll}
            >
              {/* Initial Loading */}
              {firstLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-50/70">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
                </div>
              )}

              {/* History Loading Spinner */}
              {isLoadingHistory && (
                <div className="flex justify-center py-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[75%] break-words rounded-lg p-2 ${
                    msg.sender === "user"
                      ? "ml-auto bg-blue-500 text-white"
                      : "mr-auto bg-gray-200 text-black"
                  }`}
                >
                  {msg.type === "IMAGE" && msg.text ? (
                    <div className="relative inline-block">
                      <Image
                        alt="image"
                        className="max-w-full rounded"
                        src={msg.text}
                      />
                      {msg.sending && (
                        <div className="absolute inset-0 flex items-center justify-center rounded bg-black/20">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        </div>
                      )}
                    </div>
                  ) : msg.type === "ORDER" ? (
                    <div className="rounded bg-yellow-100 p-1 font-mono text-sm text-black">
                      {msg.text}
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              ))}
            </div>

            {/* Input Area */}
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
    </>
  );
}
