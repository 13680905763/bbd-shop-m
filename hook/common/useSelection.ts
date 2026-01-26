import { useState, useCallback, useMemo, useEffect } from "react";

interface UseSelectionOptions<T> {
  idKey?: keyof T; // 子项唯一 key
  groupKey?: keyof T; // 所属父组 key，可选
}

export default function useSelection<T extends Record<string, any>>(
  data: T[],
  options: UseSelectionOptions<T> = {},
) {
  const { idKey = "id", groupKey } = options;

  // 使用 Array 存储选中的 ID
  const [selectedIds, setSelectedIds] = useState<any[]>([]);

  // 同步数据：当 data 变化时，清理掉已经不存在的 selectedIds
  useEffect(() => {
    console.log("data 变化");

    if (!data || data.length === 0) {
      console.log("data 不存在");

      setSelectedIds((prev) => (prev.length === 0 ? prev : []));

      return;
    }
    const currentIds = new Set(data.map((item) => item[idKey]));

    setSelectedIds((prev) => {
      const next = prev.filter((id) => currentIds.has(id));

      // 如果长度一致，说明所有已选 ID 都在当前列表中，无需更新
      // (prev 是 currentIds 的子集)
      return next.length === prev.length ? prev : next;
    });
  }, [data, idKey]);

  // 派生：选中的完整对象列表
  const selectedItems = useMemo(() => {
    return data.filter((item) => selectedIds.includes(item[idKey]));
  }, [data, selectedIds, idKey]);

  // 是否选中
  const isSelected = useCallback(
    (id: any) => selectedIds.includes(id),
    [selectedIds],
  );

  // 切换选择（单条）
  const onSelect = useCallback((id: any) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  // 全选
  const onSelectAll = useCallback(() => {
    const all = data.map((item) => item[idKey]);

    setSelectedIds(all);
  }, [data, idKey]);

  // 全不选
  const onClearAll = useCallback(() => {
    setSelectedIds([]);
  }, []);

  // 批量设置选中（用于适配受控组件，如 Table）
  const setSelection = useCallback((ids: any[]) => {
    setSelectedIds(ids);
  }, []);

  // 是否有选中
  const hasSelected = useMemo(() => selectedIds.length > 0, [selectedIds]);
  // 是否全部选中
  const isAllSelected = useMemo(() => {
    return data.length > 0 && selectedIds.length === data.length;
  }, [selectedIds, data]);

  // 切换全选
  const onToggleSelectAll = useCallback(() => {
    if (isAllSelected) onClearAll();
    else onSelectAll();
  }, [isAllSelected, onClearAll, onSelectAll]);

  // =========== 分组支持 ===========
  const groupIds = useMemo(() => {
    if (!groupKey) return [];
    const set = new Set(data.map((i) => i[groupKey]));

    return Array.from(set);
  }, [data, groupKey]);

  // 获得某组全部子项 id
  const getGroupItemIds = useCallback(
    (gid: any) => {
      if (!groupKey) return [];

      return data.filter((i) => i[groupKey] === gid).map((i) => i[idKey]);
    },
    [data, groupKey, idKey],
  );

  // 某组是否全选
  const isGroupAllSelected = useCallback(
    (gid: any) => {
      const ids = getGroupItemIds(gid);

      return ids.length > 0 && ids.every((id) => selectedIds.includes(id));
    },
    [getGroupItemIds, selectedIds],
  );

  // 某组切换全选
  const onToggleGroup = useCallback(
    (gid: any) => {
      const groupItemIds = getGroupItemIds(gid);
      const allChecked = groupItemIds.every((id) => selectedIds.includes(id));

      if (allChecked) {
        // 取消全选：过滤掉当前组的所有 ID
        setSelectedIds((prev) =>
          prev.filter((id) => !groupItemIds.includes(id)),
        );
      } else {
        // 全选：添加当前组未选中的 ID
        setSelectedIds((prev) => {
          const newIds = [...prev];

          groupItemIds.forEach((id) => {
            if (!newIds.includes(id)) {
              newIds.push(id);
            }
          });

          return newIds;
        });
      }
    },
    [getGroupItemIds, selectedIds],
  );

  return {
    selectedIds, // 选中的 ID 列表
    selectedItems, // 选中的对象列表
    isSelected,
    onSelect,
    isAllSelected,
    onToggleSelectAll,
    onClearAll,
    onSelectAll,
    hasSelected,
    setSelection,

    // 分组支持
    groupIds,
    isGroupAllSelected,
    onToggleGroup,
  };
}
