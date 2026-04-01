"use client";
import React, { useState, useRef } from "react";
import { IoLockClosed, IoPerson } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@heroui/react";

import { LoginParams } from "@/services";
import CommonForm from "@/components/form/common-form";
import { FieldConfig } from "@/components/form/formItem-renderer";
import { useLoginFlow } from "@/hook/business";
import { useGlobalStore } from "@/store";

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const { language } = useGlobalStore();
  const { loginAsync: handleSubmit, isLoggingIn } = useLoginFlow();
  const [formData, setFormData] = useState<LoginParams>({
    email: "",
    password: "",
  });

  const submitDataRef = useRef<LoginParams | null>(null);
  const captchaInstanceRef = useRef<any>(null);
  const loginFormFields: FieldConfig[] = [
    {
      type: "input",
      name: "email",
      required: true,
      errorMessage: t("fields.email.errorMessage"),
      placeholder: t("fields.email.placeholder"),
      startContent: <IoPerson />,
    },
    {
      type: "password",
      name: "password",
      required: true,
      placeholder: t("fields.password.placeholder"),
      errorMessage: t("fields.password.errorMessage"),
      startContent: <IoLockClosed />,
    },
  ];

  const onSubmitForm = async (data: LoginParams) => {
    submitDataRef.current = data;

    // 只有指定的域名（或者你本地 localhost 测试时）才弹验证码
    // 其他域名（比如你说的另外两个域名）不需要验证码时，直接调用成功逻辑发起登录！
    const host = window.location.hostname;
    if (host !== "www.bbdbuyeu.com" && host !== "localhost" && host !== "127.0.0.1") {
      handleCaptchaSuccess("");
      return;
    }

    const btn = document.getElementById("captcha-trigger-btn");
    if (btn) btn.click();
  };


  React.useEffect(() => {
    // 设置验证码配置
    (window as any).AliyunCaptchaConfig = { region: "cn", prefix: "esa-ky973v1gyr" };

    const initCaptcha = () => {
      if ((window as any).initAliyunCaptcha) {
        (window as any).initAliyunCaptcha({
          SceneId: "gekek24p",
          mode: "popup",
          element: "#captcha-element",
          button: "#captcha-trigger-btn",
          language: language === "zh" ? "cn" : language,
          success: function (captchaVerifyParam: string) {
            handleCaptchaSuccess(captchaVerifyParam);
          },
          fail: function (result: any) {
            console.error("Captcha fail", result);
          },
          getInstance: function (instance: any) {
            captchaInstanceRef.current = instance;
          },
          server: ['captcha-esa-open.aliyuncs.com', 'captcha-esa-open-b.aliyuncs.com'],
          slideStyle: { width: 360, height: 40 },
        });
      }
    };

    if (!document.getElementById("aliyun-captcha-script")) {
      const script = document.createElement("script");
      script.id = "aliyun-captcha-script";
      script.src = "https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js";
      script.async = true;
      script.onload = initCaptcha;
      document.body.appendChild(script);
    } else {
      if ((window as any).initAliyunCaptcha) {
        initCaptcha();
      } else {
        const existingScript = document.getElementById("aliyun-captcha-script");
        if (existingScript) {
          existingScript.addEventListener("load", initCaptcha);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleCaptchaSuccess = async (captchaVerifyParam: string) => {
    if (!submitDataRef.current) return;
    try {
      // 临时将 captchaVerifyParam 合并入提交字段发送，您之后可以根据接口情况修改
      const payload: any = {
        ...submitDataRef.current,
        // captchaVerifyParam,
      };

      await handleSubmit(payload);
    } catch (e) {
      console.error("Login failed:", e);
      // 失败后刷新验证码实例
      if (captchaInstanceRef.current) {
        captchaInstanceRef.current.refresh();
      }
    }
  };

  return (
    <>
      <CommonForm
        confirmText={t("loginButton")}
        fields={loginFormFields}
        formData={formData}
        isLoading={isLoggingIn}
        onChange={setFormData}
        onSubmit={onSubmitForm}
      >
        <Button
          className="button-default"
          onPress={() => router.push("/register")}
        >
          {t("registerButton")}
        </Button>
        <div className="mt-4 text-center">
          <span
            className="cursor-pointer text-sm text-gray-500 hover:text-primary hover:underline"
            role="button"
            onClick={() => router.push("/forget-password")}
          >
            {t("forgetPassword") || "Forget Password?"}
          </span>
        </div>
      </CommonForm>

      {/* 阿里云盾必需的挂载节点及触发按钮 */}
      <div id="captcha-element"></div>
      <button id="captcha-trigger-btn" type="button" className="hidden">
        Trigger Captcha
      </button>
    </>
  );
}
