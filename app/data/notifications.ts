export interface AdminNotification {
  id: string
  group: 'Leads' | 'Marketing' | 'Partners'
  tone: 'warning' | 'primary' | 'success' | 'error'
  title: string
  detail: string
  link: string
}

export const notificationGroups: AdminNotification['group'][] = ['Leads', 'Marketing', 'Partners']
