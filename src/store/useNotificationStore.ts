import { create } from 'zustand';
import type { NotificationItem } from '../pages/home/notificationData';

type NotificationState = {
  items: NotificationItem[];
  markAsRead: (id: string) => void;
  syncItems: (items: NotificationItem[]) => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  items: [],
  markAsRead: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, isRead: true } : item,
      ),
    })),
  syncItems: (incomingItems) =>
    set((state) => {
      const existingItemsById = new Map(
        state.items.map((item) => [item.id, item] as const),
      );
      const syncedItems = incomingItems.map((item) => {
        const existingItem = existingItemsById.get(item.id);
        if (!existingItem?.isRead) return item;
        return { ...item, isRead: true };
      });
      const preservedReadItems = state.items.filter(
        (item) =>
          item.isRead &&
          !incomingItems.some((incomingItem) => incomingItem.id === item.id),
      );

      return {
        items: [...syncedItems, ...preservedReadItems],
      };
    }),
}));
