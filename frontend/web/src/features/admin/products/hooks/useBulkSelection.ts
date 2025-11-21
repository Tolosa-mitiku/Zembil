import { useState, useCallback, useMemo } from 'react';

export const useBulkSelection = <T extends { _id: string }>(items: T[]) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map(item => item._id)));
  }, [items]);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = useCallback((id: string) => {
    return selectedIds.has(id);
  }, [selectedIds]);

  const selectedItems = useMemo(() => {
    return items.filter(item => selectedIds.has(item._id));
  }, [items, selectedIds]);

  const selectedCount = selectedIds.size;
  const allSelected = items.length > 0 && selectedIds.size === items.length;

  return {
    selectedIds,
    selectedItems,
    selectedCount,
    allSelected,
    isSelected,
    toggleSelection,
    selectAll,
    deselectAll,
  };
};

