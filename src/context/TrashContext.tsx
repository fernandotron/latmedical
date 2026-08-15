import React, { createContext, useContext, useState, useEffect } from 'react';

export type TrashItemType = 'order' | 'contact' | 'clearance' | 'product';

export interface TrashItem {
  id: string;
  originalId: string;
  type: TrashItemType;
  title: string;
  description?: string;
  data: any;
  deletedAt: number;
  expiresAt: number;
}

interface TrashContextType {
  trashItems: TrashItem[];
  addToTrash: (item: { originalId: string; type: TrashItemType; title: string; description?: string; data: any }) => void;
  removeFromTrash: (trashId: string) => TrashItem | undefined;
  emptyTrash: () => void;
  getDaysRemaining: (expiresAt: number) => number;
}

const RETENTION_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const TrashContext = createContext<TrashContextType | undefined>(undefined);

export const TrashProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trashItems, setTrashItems] = useState<TrashItem[]>(() => {
    try {
      const saved = localStorage.getItem('latmedical_trash');
      if (!saved) return [];
      const parsed: TrashItem[] = JSON.parse(saved);
      const now = Date.now();
      // Filter out items that have exceeded retention period (30 days)
      return parsed.filter(item => item.expiresAt > now);
    } catch (e) {
      console.error('Error loading trash items:', e);
      return [];
    }
  });

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('latmedical_trash', JSON.stringify(trashItems));
      fetch('/api/save-trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trashItems, null, 2)
      }).catch(() => {});
    } catch (e) {
      console.error('Error saving trash items:', e);
    }
  }, [trashItems]);

  const addToTrash = (item: { originalId: string; type: TrashItemType; title: string; description?: string; data: any }) => {
    const now = Date.now();
    const newItem: TrashItem = {
      id: `TRASH-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      originalId: item.originalId,
      type: item.type,
      title: item.title,
      description: item.description,
      data: item.data,
      deletedAt: now,
      expiresAt: now + RETENTION_DAYS * MS_PER_DAY
    };

    setTrashItems(prev => [newItem, ...prev.filter(t => t.originalId !== item.originalId)]);
  };

  const removeFromTrash = (trashId: string): TrashItem | undefined => {
    const item = trashItems.find(t => t.id === trashId);
    setTrashItems(prev => prev.filter(t => t.id !== trashId));
    return item;
  };

  const emptyTrash = () => {
    setTrashItems([]);
    localStorage.removeItem('latmedical_trash');
  };

  const getDaysRemaining = (expiresAt: number): number => {
    const diff = expiresAt - Date.now();
    return Math.max(0, Math.ceil(diff / MS_PER_DAY));
  };

  return (
    <TrashContext.Provider value={{
      trashItems,
      addToTrash,
      removeFromTrash,
      emptyTrash,
      getDaysRemaining
    }}>
      {children}
    </TrashContext.Provider>
  );
};

export const useTrash = () => {
  const context = useContext(TrashContext);
  if (!context) {
    throw new Error('useTrash must be used within a TrashProvider');
  }
  return context;
};
