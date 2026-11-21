<script setup lang="ts">
import { computed } from 'vue'
import type { PricePoint } from '@/types'

const props = withDefaults(
  defineProps<{
    points: PricePoint[]
    target?: number | null
    width?: number
    height?: number
  }>(),
  { width: 120, height: 40, target: null },
)

const PAD = 3

const bounds = computed(() => {
  const prices = props.points.map((p) => p.price)
  if (props.target != null) prices.push(props.target)
  if (prices.length === 0) return { min: 0, max: 1 }
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  return { min, max: max === min ? min + 1 : max }
})

const linePath = computed(() => {
  const pts = props.points
  if (pts.length < 2) return ''
  const { min, max } = bounds.value
  const usableW = props.width - PAD * 2
  const usableH = props.height - PAD * 2
  const stepX = usableW / (pts.length - 1)
  return pts
    .map((p, i) => {
      const x = PAD + i * stepX
      const y = PAD + usableH - ((p.price - min) / (max - min)) * usableH
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
})

const areaPath = computed(() => {
  const pts = props.points
  if (pts.length < 2) return ''
  const { min, max } = bounds.value
  const usableW = props.width - PAD * 2
  const usableH = props.height - PAD * 2
  const stepX = usableW / (pts.length - 1)
  const baseY = PAD + usableH
  const top = pts
    .map((p, i) => {
      const x = PAD + i * stepX
      const y = PAD + usableH - ((p.price - min) / (max - min)) * usableH
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  return `${top} L${(PAD + usableW).toFixed(1)},${baseY.toFixed(1)} L${PAD.toFixed(1)},${baseY.toFixed(1)} Z`
})

const targetY = computed(() => {
  if (props.target == null || props.points.length < 2) return null
  const { min, max } = bounds.value
  const usableH = props.height - PAD * 2
  return PAD + usableH - ((props.target - min) / (max - min)) * usableH
})

const trendColor = computed(() => {
  const pts = props.points
  if (pts.length < 2) return 'rgb(var(--v-theme-primary))'
  const last = pts[pts.length - 1]!.price
  const prev = pts[pts.length - 2]!.price
  if (props.target != null && last <= props.target) return 'rgb(var(--v-theme-success))'
  return last <= prev ? 'rgb(var(--v-theme-success))' : 'rgb(var(--v-theme-error))'
})

const gradientId = `spark-${Math.random().toString(36).slice(2, 9)}`
</script>

<template>
  <svg
    v-if="points.length >= 2"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    role="img"
    aria-label="Price trend"
  >
    <defs>
      <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="trendColor" stop-opacity="0.35" />
        <stop offset="100%" :stop-color="trendColor" stop-opacity="0" />
      </linearGradient>
    </defs>
    <path :d="areaPath" :fill="`url(#${gradientId})`" />
    <path :d="linePath" fill="none" :stroke="trendColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <line
      v-if="targetY != null"
      :x1="PAD"
      :x2="width - PAD"
      :y1="targetY"
      :y2="targetY"
      stroke="rgb(var(--v-theme-secondary))"
      stroke-width="1"
      stroke-dasharray="3 3"
      opacity="0.7"
    />
  </svg>
  <span v-else class="text-caption text-medium-emphasis">No history yet</span>
</template>
