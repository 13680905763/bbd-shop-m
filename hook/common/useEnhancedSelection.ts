import { useState, useCallback, useEffect, useMemo } from "react";

export interface BaseSelectionItem {
  id: string;
  [key: string]: any;
}

export interface SelectionStateItem {
  isSelected: boolean;
  quantity: number;
  remark: string;
}

export interface EnhancedSelectionResult<T> {
  // 列表数据，已合并选中状态、数量和备注
  items: (T & SelectionStateItem)[];

  // 操作方法
  toggleSelection: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateRemark: (id: string, remark: string) => void;

  // 获取方法
  getSelectedItems: () => (T & SelectionStateItem)[];
}

/**
 * 一个增强型的选择 Hook
 * 适用于需要管理多选、数量和备注的场景（如购物车、订单选择等）
 *
 * @param dataList 原始数据列表
 */
export default function useEnhancedSelection<T extends BaseSelectionItem>(
  dataList: T[] = []
): EnhancedSelectionResult<T> {
  // 内部状态：记录每个服务的选中、数量和备注
  const [selectionState, setSelectionState] = useState<
    Record<string, SelectionStateItem>
  >({});

  // 当数据列表变化时初始化状态
  useEffect(() => {
    setSelectionState((prev) => {
      const nextState = { ...prev };
      let hasChanges = false;

      // 确保列表中的每一项都有对应的状态
      dataList.forEach((item) => {
        if (!nextState[item.id]) {
          nextState[item.id] = {
            isSelected: false,
            quantity: 1,
            remark: "",
          };
          hasChanges = true;
        }
      });

      return hasChanges ? nextState : prev;
    });
  }, [dataList]);

  // 切换选中状态
  const toggleSelection = useCallback((id: string) => {
    setSelectionState((prev) => {
      const current = prev[id];
      if (!current) return prev;

      return {
        ...prev,
        [id]: {
          ...current,
          isSelected: !current.isSelected,
        },
      };
    });
  }, []);

  // 更新数量
  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;

    setSelectionState((prev) => {
      const current = prev[id];
      if (!current) return prev;

      return {
        ...prev,
        [id]: {
          ...current,
          quantity,
        },
      };
    });
  }, []);

  // 更新备注
  const updateRemark = useCallback((id: string, remark: string) => {
    setSelectionState((prev) => {
      const current = prev[id];
      if (!current) return prev;

      return {
        ...prev,
        [id]: {
          ...current,
          remark,
        },
      };
    });
  }, []);

  // 合并原始数据与状态，用于渲染
  const items = useMemo(() => {
    return dataList.map((item) => {
      const state = selectionState[item.id] || {
        isSelected: false,
        quantity: 1,
        remark: "",
      };
      return {
        ...item,
        ...state,
      };
    });
  }, [dataList, selectionState]);

  // 获取选中的项（包含完整数据）
  const getSelectedItems = useCallback(() => {
    // 过滤出选中的 ID
    const selectedIds = new Set(
      Object.entries(selectionState)
        .filter(([_, state]) => state.isSelected)
        .map(([id]) => id)
    );

    // 返回合并了状态的完整对象
    return items.filter((item) => selectedIds.has(item.id));
  }, [items, selectionState]);

  return {
    items,
    toggleSelection,
    updateQuantity,
    updateRemark,
    getSelectedItems,
  };
}
