<script setup lang="ts">
import { computed } from 'vue'
import { useTimesheetStore } from '../stores/timesheet'
import type { DayEntry } from '../stores/timesheet'

const props = defineProps<{
  index: number
  day: DayEntry
}>()

const store = useTimesheetStore()

const dayName = computed(() => {
  const dateStr = props.day.date || ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString(undefined, { weekday: 'long' })
})

const hours = computed(() => {
  if (!props.day.clockIn || !props.day.clockOut) return 0
  const inParts = props.day.clockIn.split(':')
  const outParts = props.day.clockOut.split(':')
  if (inParts.length !== 2 || outParts.length !== 2) return 0
  const inH = Number(inParts[0])
  const inM = Number(inParts[1])
  const outH = Number(outParts[0])
  const outM = Number(outParts[1])
  if (isNaN(inH) || isNaN(inM) || isNaN(outH) || isNaN(outM)) return 0
  const minutesIn = inH * 60 + inM
  const minutesOut = outH * 60 + outM
  let worked = minutesOut - minutesIn - props.day.breakMinutes
  if (worked < 0) worked = 0
  return Math.round((worked / 60) * 100) / 100
})

const projects = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Other']

function updateField(field: keyof DayEntry, value: string | number) {
  const day = store.timesheet.days[props.index]
  if (day) {
    store.timesheet.days[props.index] = { ...day, [field]: value }
  }
}
</script>

<template>
  <v-card class="pa-4">
    <v-row justify="space-between" align="center">
      <v-col cols="2">
        <v-select
          :model-value="props.day.project"
          :items="projects"
          label="Project"
          dense
          @update:model-value="updateField('project', $event)"
        />
      </v-col>
      <v-col cols="2">
        <v-text-field :model-value="props.day.notes" label="Notes" dense @update:model-value="updateField('notes', $event)" />
      </v-col>
    </v-row>

    <v-row justify="space-between" align="center">
      <v-col cols="2">
        <v-text-field
          :model-value="props.day.clockIn"
          type="time"
          label="Clock In"
          dense
          @update:model-value="updateField('clockIn', $event)"
        />
      </v-col>
      <v-col cols="2">
        <v-text-field
          :model-value="props.day.clockOut"
          type="time"
          label="Clock Out"
          dense
          @update:model-value="updateField('clockOut', $event)"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          :model-value="props.day.breakMinutes"
          :items="[{ label: 30, value: 30 }, { label: 45, value: 45 }, { label: 60, value: 60 }]"
          label="Break (min)"
          dense
          @update:model-value="updateField('breakMinutes', $event)"
        />
      </v-col>
    </v-row>
  </v-card>
</template>