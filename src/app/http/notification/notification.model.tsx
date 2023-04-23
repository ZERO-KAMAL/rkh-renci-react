// Notification
export interface Notification {
  page: number
  limit: number
  type: string
  content: string
  createdAt: string
  id: number
  subtitle: string
  title: string
  userId: number
  loading: boolean
  isAlert: boolean
  read: boolean
  refId: number
}

export interface NotificationList {
  count: number
  rows: Notification[] | []
}

export interface SortingType {
  sortDir: 'asc' | 'desc'
  sortBy: string | null
}

export interface params {
  page: number
  limit: number
  text: string | ''
  type: string
  order: SortingType
  isAlert: boolean | ''
  userId: number | undefined
  read: boolean | undefined
}
