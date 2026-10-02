import { and, gte, lte } from 'drizzle-orm'
import type { Lead } from '../../../app/data/crm-leads'
import { addDays, isWeekend } from '../../../app/data/marketing'
import { getLeadNudge } from '../../../app/utils/leadNudges'
import type { AdminNotification } from '../../../app/data/notifications'

// Notifications are derived from the current data rather than stored: each one describes something
// that still needs doing, and disappears once it's done.
export default defineEventHandler(async (event): Promise<AdminNotification[]> => {
  const session = await getUserSession(event)
  const user = session.data
  const db = useDb()
  const today = todayISO()
  const items: AdminNotification[] = []

  // Leads needing action (staff only see their branch)
  const allLeads = (await db.select().from(tables.leads).all()) as Lead[]
  const leads = user?.authRole === 'staff' ? allLeads.filter((lead) => lead.location === user.location) : allLeads
  for (const lead of leads) {
    const nudge = getLeadNudge(lead)
    if (!nudge) continue
    items.push({
      id: `lead-${lead.id}`,
      group: 'Leads',
      tone: nudge.tone,
      title: `${nudge.message}: ${lead.name}`,
      detail: `${lead.partsNeeded} · ${lead.location} · ${lead.assignedTo}`,
      link: `/admin/pipeline?lead=${lead.id}`,
    })
  }

  // Marketing tasks: today's open tasks plus overdue ones from the last 7 days
  const from = addDays(today, -7)
  await ensureRoutineTasks(db, from, today)
  const tasks = await db
    .select()
    .from(tables.marketingTasks)
    .where(and(gte(tables.marketingTasks.date, from), lte(tables.marketingTasks.date, today)))
    .all()
  const open = tasks.filter((task) => !task.completedBy)

  const todayOpen = open.filter((task) => task.date === today)
  if (todayOpen.length && !isWeekend(today)) {
    items.push({
      id: 'tasks-today',
      group: 'Marketing',
      tone: 'primary',
      title: `${todayOpen.length} marketing ${todayOpen.length === 1 ? 'task' : 'tasks'} left today`,
      detail: todayOpen.slice(0, 3).map((task) => task.title).join(' · '),
      link: '/admin/marketing',
    })
  }
  // Same rule as the marketing overview: only tasks that existed on their due date count as overdue.
  for (const task of open.filter((task) => task.date < today && task.createdAt <= task.date)) {
    items.push({
      id: `task-${task.id}`,
      group: 'Marketing',
      tone: 'warning',
      title: `Overdue: ${task.title}`,
      detail: `Due ${task.date}`,
      link: '/admin/marketing/calendar',
    })
  }

  // Partners that have stalled in conversation or on trial for a week
  const weekAgo = addDays(today, -7)
  const partners = await db.select().from(tables.marketingPartners).all()
  for (const partner of partners) {
    if ((partner.status === 'Contacted' || partner.status === 'Trial') && partner.updatedAt <= weekAgo) {
      items.push({
        id: `partner-${partner.id}`,
        group: 'Partners',
        tone: 'primary',
        title: `Follow up with ${partner.name}`,
        detail: `${partner.status} since ${partner.updatedAt}`,
        link: '/admin/marketing/partners',
      })
    }
  }

  return items
})
