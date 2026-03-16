import { Button, Input } from "@heroui/react";
import { useState, useEffect } from "react";

interface VerificationCodeItemProps {
  value: string;
  onChange: (value: string) => void;
  onSendCode?: () => Promise<void>;
  sendCodeText?: string;
  errorMessage?: string;
  required?: boolean;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  isDisabled?: boolean;
  label?: string;
  isSendDisabled?: boolean;
}

export default function VerificationCodeItem({
  value,
  onChange,
  onSendCode,
  sendCodeText = "Send Code",
  errorMessage,
  required,
  placeholder,
  size = "md",
  isDisabled,
  label,
  isSendDisabled,
}: VerificationCodeItemProps) {
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendCode = async () => {
    if (!onSendCode || isSending || countdown > 0 || isSendDisabled) return;

    setIsSending(true);
    try {
      await onSendCode();
      setCountdown(60);
    } catch (error) {
      console.error("Failed to send verification code:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex gap-2 w-full items-start">
      <Input
        classNames={{
          input: "text-base",
          inputWrapper: "bg-white",
        }}
        errorMessage={errorMessage}
        isDisabled={isDisabled}
        isRequired={required}
        label={label}
        placeholder={placeholder}
        size={size}
        type="text"
        value={value}
        variant="bordered"
        onValueChange={onChange}
        className="flex-1"
      />
      <Button
        className="w-32 flex-shrink-0"
        color={countdown > 0 || isSending || isSendDisabled ? "default" : "primary"}
        isDisabled={countdown > 0 || isSending || isDisabled || isSendDisabled}
        isLoading={isSending}
        size={size}
        onPress={handleSendCode}
      >
        {countdown > 0 ? `${countdown}s` : sendCodeText}
      </Button>
    </div>
  );
}
