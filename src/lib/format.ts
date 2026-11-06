const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

/** "2026-11-05" → "5 Kasım 2026". Boş değer için tire döner. */
export function formatDate(value: string | null | undefined) {
  if (!value) return '—'
  return dateFormatter.format(new Date(value))
}

/** "2026-11-05T14:30" → "5 Kas 14:30" */
export function formatDateTime(value: string | null | undefined) {
  if (!value) return '—'
  return dateTimeFormatter.format(new Date(value))
}

export function formatSalaryRange(
  min: number | null,
  max: number | null,
  currency: string,
) {
  const format = (n: number) =>
    new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(n)

  if (min != null && max != null) return `${format(min)} – ${format(max)}`
  if (min != null) return `${format(min)} +`
  if (max != null) return `${format(max)}'e kadar`
  return '—'
}

/** Bugünün tarihini <input type="date"> formatında verir: "2026-11-05" */
export function todayIsoDate() {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60_000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}
