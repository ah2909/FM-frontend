import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface Notification {
  id: number
  user_id: number
  asset_id: number
  type: string
  transaction_count: number | null
  amount: number | null
  is_read: boolean
  created_at: string
  symbol: string
  img_url: string
  name: string
}

interface NotificationsState {
  notifications: Notification[]
  unreadCount: number
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications(
      state,
      action: PayloadAction<{ notifications: Notification[]; unread_count: number }>
    ) {
      state.notifications = action.payload.notifications
      state.unreadCount = action.payload.unread_count
    },
    prependNotification(state, action: PayloadAction<Notification>) {
      state.notifications.unshift(action.payload)
      state.unreadCount += 1
    },
    markRead(state, action: PayloadAction<number>) {
      const n = state.notifications.find((n) => n.id === action.payload)
      if (n && !n.is_read) {
        n.is_read = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },
    markAllRead(state) {
      state.notifications.forEach((n) => (n.is_read = true))
      state.unreadCount = 0
    },
  },
})

export const { setNotifications, prependNotification, markRead, markAllRead } =
  notificationsSlice.actions
export default notificationsSlice.reducer
