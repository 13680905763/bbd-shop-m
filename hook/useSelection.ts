import { useState, useCallback, useMemo } from "react";

interface UseSelectionOptions<T> {
  idKey?: keyof T; // 子项唯一 key
  groupKey?: keyof T; // 所属父组 key，可选
}

export function useSelection<T extends Record<string, any>>(
  data: T[],
  options: UseSelectionOptions<T> = {},
) {
  const { idKey = "id", groupKey } = options;

  const [selectedIds, setSelectedIds] = useState<Array<T[keyof T]>>([]);

  // 是否选中
  const isSelected = useCallback(
    (id: T[keyof T]) => selectedIds.includes(id),
    [selectedIds],
  );

  // 切换选择（单条）
  const toggle = useCallback((id: T[keyof T]) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  // 全选
  const selectAll = useCallback(() => {
    const all = data.map((item) => item[idKey]);

    setSelectedIds(all);
  }, [data, idKey]);

  // 全不选
  const unselectAll = useCallback(() => {
    setSelectedIds([]);
  }, []);

  // 是否有选中
  const hasSelected = useMemo(() => selectedIds.length > 0, [selectedIds]);
  // 是否全部选中
  const isAllSelected = useMemo(() => {
    return data.length > 0 && selectedIds.length === data.length;
  }, [selectedIds, data]);
  // 切换全选
  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) unselectAll();
    else selectAll();
  }, [isAllSelected, unselectAll, selectAll]);

  // =========== 分组支持 ===========
  const groupIds = useMemo(() => {
    if (!groupKey) return [];
    const set = new Set(data.map((i) => i[groupKey]));

    return Array.from(set) as T[keyof T][];
  }, [data, groupKey]);

  // 获得某组全部子项 id
  const getGroupItemIds = useCallback(
    (gid: T[keyof T]) => {
      if (!groupKey) return [];

      return data
        .filter((i) => i[groupKey] === gid)
        .map((i) => i[idKey]) as T[keyof T][];
    },
    [data, groupKey, idKey],
  );

  // 某组是否全选
  const isGroupAllSelected = useCallback(
    (gid: T[keyof T]) => {
      const ids = getGroupItemIds(gid);

      return ids.length > 0 && ids.every((id) => selectedIds.includes(id));
    },
    [getGroupItemIds, selectedIds],
  );

  // 某组切换全选
  const toggleGroup = useCallback(
    (gid: T[keyof T]) => {
      const groupIds = getGroupItemIds(gid);
      const allChecked = groupIds.every((id) => selectedIds.includes(id));

      if (allChecked) {
        setSelectedIds((prev) => prev.filter((id) => !groupIds.includes(id)));
      } else {
        setSelectedIds((prev) => [...new Set([...prev, ...groupIds])]);
      }
    },
    [getGroupItemIds, selectedIds],
  );

  return {
    selectedIds,
    isSelected,
    toggle,
    isAllSelected,
    toggleSelectAll,
    unselectAll,
    selectAll,
    hasSelected,

    // 分组支持
    groupIds,
    isGroupAllSelected,
    toggleGroup,
  };
}
