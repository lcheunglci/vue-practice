export function formatCurrency(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return 'Never'
  return new Date(iso).toLocaleString()
}

export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return 'Never'
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 0) return 'just now'
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function discountPercent(
  current: number | null,
  original: number | null,
): number {
  if (current == null || original == null || original <= 0) return 0
  if (current >= original) return 0
  return Math.round(((original - current) / original) * 100)
}
