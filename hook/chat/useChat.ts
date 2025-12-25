import { useState, useEffect, useRef, useCallback } from "react";
import { fetchChatHistory, uploadChatImage } from "@/services";
import { addToast } from "@heroui/react";
import { useTranslations } from "next-intl";

export interface Message {
  id: number | string;
  sender: "user" | "bot";
  text?: string;
  type?: "TEXT" | "IMAGE" | "ORDER";
  sending?: boolean;
}

export function useChat(user: any, isOpen: boolean) {
  const t = useTranslations("components.chatbox");
  const [messages, setMessages] = useState<Message[]>([]);
  const [receiverId, setReceiverId] = useState<number | null>(null);
  const [hasAgent, setHasAgent] = useState(false);

  // History loading state
  const [page, setPage] = useState(1);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [firstLoading, setFirstLoading] = useState(false);

  // Refs for logic (to avoid stale closures and rapid events)
  const loadingRef = useRef(false);
  const socketRef = useRef<WebSocket | null>(null);
  const receiverIdRef = useRef<number | null>(null);
  const shouldScrollRef = useRef(false); // To signal UI to scroll

  // WebSocket Connection
  useEffect(() => {
    if (!user?.id || !isOpen) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      return;
    }

    let socket: WebSocket | null = null;
    let retryTimer: NodeJS.Timeout | null = null;
    let retryCount = 0;
    let allowReconnect = true;
    const MAX_RETRY = 5;
    const RETRY_DELAY = 3000;

    const initWebSocket = () => {
      if (!allowReconnect) return;

      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!apiBase) {
        console.error("❌ 缺少 NEXT_PUBLIC_API_BASE_URL");
        return;
      }

      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      const host = apiBase.replace(/^https?:\/\//, "");
      const wsUrl = `${protocol}://${host}/ws`;

      if (socket && socket.readyState === WebSocket.OPEN) {
        return;
      }

      console.log(`🔌 尝试连接 WebSocket (${retryCount + 1}/${MAX_RETRY})`);
      socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("✅ WebSocket 已连接");
        retryCount = 0;
        if (retryTimer) clearTimeout(retryTimer);
        retryTimer = null;
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.sender === "SERVER" && !receiverIdRef.current) {
            receiverIdRef.current = data.receiverId;
            setReceiverId(data.receiverId);
            setHasAgent(true);
          }

          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              sender: data.sender === "CUSTOMER" ? "user" : "bot",
              text: data.content,
              type: data.type,
            },
          ]);
          shouldScrollRef.current = true;
        } catch (err) {
          console.error("❌ 解析消息失败:", err, event.data);
        }
      };

      socket.onclose = (event) => {
        console.warn(`⚠️ WebSocket 关闭 (code=${event.code})`);
        socketRef.current = null;
        if (allowReconnect && retryCount < MAX_RETRY) {
          retryCount++;
          retryTimer = setTimeout(initWebSocket, RETRY_DELAY);
        }
      };

      socket.onerror = (err) => {
        console.error("⚠️ WebSocket 错误:", err);
        socket?.close();
      };
    };

    const timer = setTimeout(initWebSocket, 100);

    return () => {
      allowReconnect = false;
      clearTimeout(timer);
      if (retryTimer) clearTimeout(retryTimer);
      socket?.close();
      socketRef.current = null;
    };
  }, [user?.id, isOpen]);

  // Load History
  const loadHistory = useCallback(async (initialLoad = false) => {
    if (loadingRef.current) return;
    // If not initial load and no more history, stop
    if (!initialLoad && !hasMoreHistory) return;

    loadingRef.current = true;
    setIsLoadingHistory(true);

    try {
      // If initial load, use page 1, else use current page
      const currentPage = initialLoad ? 1 : page;
      const res: any = await fetchChatHistory(user!.id, currentPage);
      const records: any = res.records || [];
      const lastPage: number = res.pages ?? 1;

      const newMessages = records.reverse().map((msg: any) => ({
        id: msg?.id ?? `srv-${Date.now()}-${Math.random()}`,
        sender: msg.sender === "CUSTOMER" ? "user" : "bot",
        type: msg.contentType,
        text: msg.content,
      }));

      if (initialLoad) {
        setMessages(newMessages);
        setPage(2); // Next page is 2
        setHasMoreHistory(1 < lastPage);
        shouldScrollRef.current = true;

        // Check for agent
        const hisM = records.filter((item: any) => item.sender === "SERVER");
        if (hisM.length) {
          receiverIdRef.current = hisM[0].userId;
          setReceiverId(hisM[0].userId);
        }
      } else {
        setMessages((prev) => [...newMessages, ...prev]);
        setPage((prev) => prev + 1);
        setHasMoreHistory(currentPage < lastPage);
        shouldScrollRef.current = false; // Don't scroll to bottom on history load
      }
    } catch (err) {
      console.error("获取历史消息失败", err);
    } finally {
      loadingRef.current = false;
      setIsLoadingHistory(false);
    }
  }, [user?.id, page, hasMoreHistory]);

  // Initial Load Effect
  useEffect(() => {
    if (isOpen && user?.id) {
      setFirstLoading(true);
      loadHistory(true).finally(() => setFirstLoading(false));
    } else {
      // Reset when closed
      setMessages([]);
      setPage(1);
      setHasMoreHistory(true);
      setReceiverId(null);
    }
  }, [isOpen, user?.id]); // Removed loadHistory dependency to avoid loops if loadHistory isn't memoized correctly, but I memoized it.

  // Send Message
  const sendMessage = useCallback((msgText: string, type: Message["type"] = "TEXT") => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        addToast({ title: t("connectionLost"), color: "danger" });
        return;
    }

    const payload: any = {
      sender: "CUSTOMER",
      type,
      content: msgText,
      sendTime: new Date().toISOString(),
      receiverId,
    };

    if (receiverIdRef.current) payload.receiverId = receiverIdRef.current;
    socket.send(JSON.stringify(payload));

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: msgText, type },
    ]);
    shouldScrollRef.current = true;
  }, [receiverId, t]);

  // Upload Image
  const sendImage = useCallback(async (file: File) => {
     if (!user?.id) return;
     
     const tempId = Date.now();
     const tempUrl = URL.createObjectURL(file);

     // Add temporary message
     setMessages((prev) => [
       ...prev,
       {
         id: tempId,
         sender: "user",
         type: "IMAGE",
         sending: true,
         text: tempUrl,
       },
     ]);
     shouldScrollRef.current = true;

     try {
       const url: any = await uploadChatImage(file);
       if (url) {
         const socket = socketRef.current;
         if (socket && socket.readyState === WebSocket.OPEN) {
           const payload: any = {
             sender: "CUSTOMER",
             type: "IMAGE",
             content: url,
             sendTime: new Date().toISOString(),
           };
           if (receiverIdRef.current) payload.receiverId = receiverIdRef.current;
           socket.send(JSON.stringify(payload));
         }

         setMessages((prev) =>
           prev.map((msg) =>
             msg.id === tempId ? { ...msg, sending: false, text: url } : msg
           )
         );
       }
     } catch (err) {
       setMessages((prev) =>
         prev.map((msg) =>
           msg.id === tempId
             ? { ...msg, sending: false, text: t("imageSendFail") }
             : msg
         )
       );
     } finally {
       URL.revokeObjectURL(tempUrl);
     }
  }, [user?.id, receiverId, t]);

  return {
    messages,
    sendMessage,
    sendImage,
    loadMoreHistory: () => loadHistory(false),
    isLoadingHistory,
    firstLoading,
    hasMoreHistory,
    shouldScrollRef,
    hasAgent
  };
}
