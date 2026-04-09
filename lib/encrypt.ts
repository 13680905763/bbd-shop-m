import JSEncrypt from "jsencrypt";
import { configApi } from "@/services/configApi";

/**
 * 加密密码和账号
 * @param data 需要加密的数据对象
 * @param fields 需要加密的字段列表，默认为 ["password", "mobile", "email", "oldPassword", "newPassword"]
 * @returns 
 */
export const encryptField = async (
  data: any,
  fields: string[] = ["password", "mobile", "email", "oldPassword", "newPassword", 'code', 'authorizationCode', 'activationCode', 'verificationCode'],
) => {
  try {
    const publicKeyRes = await configApi.getPublicKey();

    if (publicKeyRes) {
      const encrypt = new JSEncrypt();

      let key = publicKeyRes;

      if (!key.includes("-----BEGIN PUBLIC KEY-----")) {
        key = `-----BEGIN PUBLIC KEY-----\n${key}\n-----END PUBLIC KEY-----`;
      }
      encrypt.setPublicKey(key);

      const finalData = { ...data };

      for (const field of fields) {
        if (data[field]) {
          const encrypted = encrypt.encrypt(data[field]);

          if (encrypted) {
            finalData[field] = encrypted;
          } else {
            throw new Error(`${field} 加密失败`);
          }
        }
      }

      return finalData;
    } else {
      throw new Error("获取公钥失败，加密中止");
    }
  } catch (error) {
    console.error("RSA Encryption error:", error);
    throw error;
  }
};
