/**
 * 计算总价
 * @param prices 价格数组 (支持字符串或数字)
 * @returns 格式化后的总价 (两位小数)
 */
export const calculateTotal = (prices: (string | number)[]) => {
  const totalInCents = prices.reduce((sum, price) => {
    const fee = Number(price || 0);

    // 防止 NaN
    if (isNaN(fee)) return sum;

    return Number(sum) + Math.round(fee * 100);
  }, 0);

  return (Number(totalInCents) / 100).toFixed(2);
};
