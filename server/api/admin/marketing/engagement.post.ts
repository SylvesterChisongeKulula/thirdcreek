import { weekStartOf, type EngagementLog } from '../../../../app/data/marketing'

type EngagementInput = Pick<
  EngagementLog,
  'weekStart' | 'postsPublished' | 'comments' | 'messages' | 'newFollowers' | 'reach' | 'notes'
>

const count = (value: unknown) => Math.max(0, Math.round(Number(value) || 0))

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<EngagementInput>>(event)
  const session = await getUserSession(event)

  const values = {
    weekStart: weekStartOf(assertISODate(body.weekStart, 'weekStart')),
    postsPublished: count(body.postsPublished),
    comments: count(body.comments),
    messages: count(body.messages),
    newFollowers: count(body.newFollowers),
    reach: count(body.reach),
    notes: body.notes?.trim() ?? '',
    loggedBy: session.data?.name ?? 'Unknown',
  }

  // One log per week: logging the same week again replaces its numbers.
  const [log] = await useDb()
    .insert(tables.marketingEngagement)
    .values({ ...values, createdAt: todayISO() })
    .onConflictDoUpdate({ target: tables.marketingEngagement.weekStart, set: values })
    .returning()
  return log
})
