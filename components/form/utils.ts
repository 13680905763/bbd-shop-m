import { FieldConfig } from "./formItem-renderer";

export const validateField = (
  field: FieldConfig,
  formData: Record<string, any>,
): boolean => {
  if (!field.required) return true;

  switch (field.type) {
    case "dimensions": {
      const isWeightFilled = formData.weight && Number(formData.weight) > 0;
      const isSizeFilled =
        formData.length &&
        Number(formData.length) > 0 &&
        formData.width &&
        Number(formData.width) > 0 &&
        formData.height &&
        Number(formData.height) > 0;

      return !!(isWeightFilled || isSizeFilled);
    }
    case "autocomplete":
    case "select":
    case "input":
    case "password":
    case "area":
    case "date": {
      const value = formData[field.name];

      // 检查空字符串、null、undefined、0（如果是 ID）
      if (typeof value === "string") {
        return value.trim() !== "";
      }
      if (typeof value === "number") {
        return value !== 0; // 假设 ID 0 是无效的
      }

      return value !== null && value !== undefined;
    }
    default:
      return true;
  }
};
