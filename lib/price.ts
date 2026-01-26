/**
 * 计算总价，解决浮点数精度问题 (原生实现，无依赖)
 * 核心逻辑：先转为整数进行运算，最后再转回小数
 * @param items 商品列表
 * @param priceKey 价格字段名
 * @returns 格式化后的总价字符串 (保留两位小数)
 */
export function calculateTotalPrice<T>(
  items: T[],
  priceKey: keyof T = "totalFee" as keyof T,
): string {
  if (!items || items.length === 0) return "0.00";

  // 使用 BigInt 或 乘数法来解决精度问题
  // 这里采用乘数法 (x 100)，因为金额通常只到分
  const MULTIPLIER = 100;

  const totalCents = items.reduce((sum, item) => {
    const price = Number(item[priceKey]) || 0;
    // 将金额转为“分”（整数），使用 Math.round 防止 19.99 * 100 = 1998.9999999 这种情况
    const cents = Math.round(price * MULTIPLIER);

    return sum + cents;
  }, 0);

  // 转回元，并保留两位小数
  return (totalCents / MULTIPLIER).toFixed(2);
}
