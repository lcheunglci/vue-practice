<script setup lang="ts">
import { computed } from 'vue'
import type { PricePoint } from '@/types'
import { formatCurrency } from '@/utils/format'

const props = withDefaults(
  defineProps<{
    points: PricePoint[]
    target?: number | null
  }>(),
  { target: null },
)

const W = 800
const H = 280
const PAD_L = 56
const PAD_R = 16
const PAD_T = 16
const PAD_B = 32

const innerW = W - PAD_L - PAD_R
const innerH = H - PAD_T - PAD_B

const bounds = computed(() => {
  const prices = props.points.map((p) => p.price)
  if (props.target != null) prices.push(props.target)
  if (prices.length === 0) return { min: 0, max: 1 }
  let min = Math.min(...prices)
  let max = Math.max(...prices)
  if (min === max) {
    min -= 1
    max += 1
  }
  const pad = (max - min) * 0.1
  return { min: min - pad, max: max + pad }
})

function xAt(index: number): number {
  if (props.points.length <= 1) return PAD_L + innerW / 2
  return PAD_L + (index / (props.points.length - 1)) * innerW
}

function yAt(price: number): number {
  const { min, max } = bounds.value
  return PAD_T + innerH - ((price - min) / (max - min)) * innerH
}

const linePath = computed(() => {
  if (props.points.length < 2) return ''
  return props.points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${xAt(i).toFixed(1)},${yAt(p.price).toFixed(1)}`)
    .join(' ')
})

const areaPath = computed(() => {
  if (props.points.length < 2) return ''
  return `${linePath.value} L${xAt(props.points.length - 1).toFixed(1)},${(PAD_T + innerH).toFixed(1)} L${xAt(0).toFixed(1)},${(PAD_T + innerH).toFixed(1)} Z`
})

const yTicks = computed(() => {
  const { min, max } = bounds.value
  const count = 4
  return Array.from({ length: count + 1 }, (_, i) => {
    const value = min + ((max - min) * i) / count
    return { value, y: yAt(value) }
  })
})

const xLabels = computed(() => {
  const pts = props.points
  if (pts.length === 0) return []
  const indices = pts.length === 1 ? [0] : [0, Math.floor((pts.length - 1) / 2), pts.length - 1]
  const seen = new Set<number>()
  return indices
    .filter((i) => {
      if (seen.has(i)) return false
      seen.add(i)
      return true
    })
    .map((i) => ({
      x: xAt(i),
      label: new Date(pts[i]!.date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }),
    }))
})

const targetY = computed(() => (props.target != null ? yAt(props.target) : null))
</script>

<template>
  <div v-if="points.length >= 2" class="w-100">
    <svg :viewBox="`0 0 ${W} ${H}`" class="w-100" role="img" aria-label="Price history chart">
      <defs>
        <linearGradient id="history-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--v-theme-primary)" stop-opacity="0.28" />
          <stop offset="100%" stop-color="var(--v-theme-primary)" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- Y grid + labels -->
      <g v-for="tick in yTicks" :key="tick.value">
        <line
          :x1="PAD_L"
          :x2="W - PAD_R"
          :y1="tick.y"
          :y2="tick.y"
          stroke="var(--v-border-color)"
          stroke-width="1"
          stroke-dasharray="4 4"
          opacity="0.5"
        />
        <text
          :x="PAD_L - 8"
          :y="tick.y + 4"
          text-anchor="end"
          font-size="11"
          fill="var(--v-theme-on-surface)"
          opacity="0.6"
        >
          {{ formatCurrency(tick.value) }}
        </text>
      </g>

      <!-- X labels -->
      <text
        v-for="label in xLabels"
        :key="label.label"
        :x="label.x"
        :y="H - 8"
        text-anchor="middle"
        font-size="11"
        fill="var(--v-theme-on-surface)"
        opacity="0.6"
      >
        {{ label.label }}
      </text>

      <!-- Target line -->
      <g v-if="targetY != null">
        <line
          :x1="PAD_L"
          :x2="W - PAD_R"
          :y1="targetY"
          :y2="targetY"
          stroke="var(--v-theme-secondary)"
          stroke-width="1.5"
          stroke-dasharray="6 4"
        />
        <text
          :x="W - PAD_R"
          :y="targetY - 5"
          text-anchor="end"
          font-size="11"
          fill="var(--v-theme-secondary)"
        >
          Target {{ formatCurrency(target) }}
        </text>
      </g>

      <!-- Area + line -->
      <path :d="areaPath" fill="url(#history-fill)" />
      <path
        :d="linePath"
        fill="none"
        stroke="var(--v-theme-primary)"
        stroke-width="2.5"
        stroke-linejoin="round"
        stroke-linecap="round"
      />

      <!-- Last point -->
      <circle
        v-if="points.length > 0"
        :cx="xAt(points.length - 1)"
        :cy="yAt(points[points.length - 1]!.price)"
        r="4"
        fill="var(--v-theme-primary)"
        stroke="var(--v-theme-surface)"
        stroke-width="2"
      />
    </svg>
  </div>
  <v-alert v-else type="info" variant="tonal">
    Not enough price history yet. Refresh this product a few times to build a chart.
  </v-alert>
</template>
