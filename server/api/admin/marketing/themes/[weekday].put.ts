export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const weekday = Number(getRouterParam(event, 'weekday'))
  if (!Number.isInteger(weekday) || weekday < 1 || weekday > 5) {
    throw createError({ statusCode: 400, statusMessage: 'Day must be Monday–Friday' })
  }

  const body = await readBody<{ theme?: string; example?: string }>(event)
  const theme = body.theme?.trim()
  if (!theme) throw createError({ statusCode: 400, statusMessage: 'Theme is required' })
  const values = { weekday, theme, example: body.example?.trim() ?? '' }

  const db = useDb()
  await db
    .insert(tables.marketingDayThemes)
    .values(values)
    .onConflictDoUpdate({ target: tables.marketingDayThemes.weekday, set: { theme: values.theme, example: values.example } })
  // Task titles like "Publish: {theme}" are baked in when scheduled, so reschedule that day.
  await resetUpcomingRoutineTasks(db, { weekday })
  return values
})
