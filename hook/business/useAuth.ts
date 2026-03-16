import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi, LoginRequest, SignUpRequest } from "@/services";
import { queryClient } from "@/lib/react-query";
import { addToast } from "@heroui/react";
import { useState } from "react";
// 注册验证
export const useSignUpFlow = () => {
  const router = useRouter();
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const signUp = useMutation({
    mutationFn: (data: SignUpRequest) => authApi.signUp(data),
    onSuccess: (_, variables) => {
      setRegisteredEmail(variables.email);
      setIsEmailVerified(true);
    },
    onError: (error: any) => {
      addToast({ title: error?.message || "注册失败", color: "danger" });
    },
  });
  const activateEmail = useMutation({
    mutationFn: (data: any) => authApi.activateEmail(data),
    // mutationFn: (data: ActivateEmailRequest) => authApi.activateEmail(data),
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: (error: any) => {
      addToast({ title: error?.message || "验证失败", color: "danger" });
    },
  });

  return {
    // 状态
    isEmailVerified,
    registeredEmail,
    setIsEmailVerified,

    // 注册
    signUp: signUp.mutate,
    isSigningUp: signUp.isPending,

    // 验证
    activateEmail: activateEmail.mutate,
    isActivating: activateEmail.isPending,
  };
};
// 登录
export const useLoginFlow = () => {
  const router = useRouter();
  const login = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: () => {
      router.push("/dashboard");
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      queryClient.invalidateQueries({ queryKey: ["walletInfo"] });
    },
    onError: (error: any) => {
      const message = error?.message || "Login failed, please try again";
      addToast({
        title: message,
        timeout: 1000,
        color: "danger"
      });
    },
  });
  return {
    login: login.mutate,
    isLoggingIn: login.isPending,
  }
};
export const useGoogleLoginFlow = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // 注意：这需要在客户端组件中使用
  const googleLogin = useMutation({
    mutationFn: (data: { authorizationCode: string; inviteCode?: string }) =>
      authApi.loginWithGoogle(data),
    onSuccess: () => {
      const redirect = searchParams?.get("redirect") || "/dashboard";
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      queryClient.invalidateQueries({ queryKey: ["walletInfo"] });
      router.push(redirect);
    },
    onError: (error: any) => {
      addToast({
        title: error?.message || "Google Login Failed, please try again",
        timeout: 1000,
        color: "danger",
      });
    },
  });
  return {
    login: googleLogin.mutate,
    isLoggingIn: googleLogin.isPending,
  };
};
export const useLogoutFlow = () => {
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // 清除所有缓存
      queryClient.clear();
      window.location.reload();
    },
    onError: (error: any) => {
      addToast({
        title: error?.message || "Logout Failed, please try again",
        timeout: 1000,
        color: "danger",
      });
    },
  });
  return {
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
};
