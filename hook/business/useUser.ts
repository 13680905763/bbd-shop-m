import { useMutation, useQuery } from "@tanstack/react-query";

import { userApi } from "@/services/userApi";
import { queryClient } from "@/lib/react-query";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";

/** 获取用户信息 */
export const useUserInfo = () => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: userApi.getUserInfo,
    staleTime: 10 * 1000, // 十秒保证积分数据足够新
    refetchOnWindowFocus: true,
  });
};
/** 更新用户信息 */
export const useUpdateUserInfo = () => {
  const updateUserInfoMutation = useMutation({
    mutationFn: (data: any) => userApi.updateUserInfo(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      addToast({
        title: res || "Update user info success",
        timeout: 1000,
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: error?.message || "Update user info failed, please try again",
        timeout: 1000,
        color: "danger",
      });
    },
  });
  return {
    updateUserInfo: updateUserInfoMutation.mutate,
    isUpdating: updateUserInfoMutation.isPending,
  }
};
/** 上传用户头像 */
export const useUploadAvatar = () => {
  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => userApi.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    },
    onError: (error: any) => {
      addToast({
        title: error?.message || "Upload avatar failed, please try again",
        timeout: 3000,
        color: "danger",
      });
    },
  });
  return {
    uploadAvatar: uploadAvatarMutation.mutate,
    isUploading: uploadAvatarMutation.isPending,
  }
};
export const useChangePassword = () => {
  const router = useRouter();
  const changePasswordMutation = useMutation({
    mutationFn: (data: any) => userApi.changePassword(data),
    onSuccess: (res) => {
      addToast({
        title: res || "Change password success",
        timeout: 1000,
        color: "success",
      });
      queryClient.clear();
      router.push("/login");
    },
    onError: (error: any) => {
      addToast({
        title: error?.message || "Change password failed, please try again",
        timeout: 1000,
        color: "danger",
      });
    },
  });
  return {
    changePassword: changePasswordMutation.mutate,
    isChanging: changePasswordMutation.isPending,
  }
};
export const useUserExperience = () => {
  return useQuery({
    queryKey: ["userExperience"],
    queryFn: userApi.getExperience,
    staleTime: 10 * 1000, // 十秒保证积分数据足够新
    refetchOnWindowFocus: true,
  });
};