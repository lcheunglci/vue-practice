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
  const [inH, inM] = props.day.clockIn.split(':').map(Number)
  const [outH, outM] = props.day.clockOut.split(':').map(Number)
  const minutesIn = inH * 60 + inM
  const minutesOut = outH * 60 + outM
  let worked = minutesOut - minutesIn - props.day.breakMinutes
  if (worked < 0) worked = 0
  return Math.round((worked / 60) * 100) / 100
})

function updateField(field: keyof DayEntry, value: string | number) {
  const day = store.timesheet.days[props.index]
  store.timesheet.days[props.index] = { ...day, [field]: value }
}
</script>

<template>
  <v-card class="pa-4">
    <v-row justify="space-between" align="center">
      <v-col cols="2">
        <v-select
          v-model="props.day.project"
          :items="['Project Alpha', 'Project Beta', 'Project Gamma', 'Other']"
          label="Project"
          dense
        >
          <template #no-data>
            <v-chip>No projects available</v-chip>
          </template>
        </v-select>
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="props.day.notes" label="Notes" dense></v-text-field>
      </v-col>
    </v-row>

    <v-row justify="space-between" align="center">
      <v-col cols="2">
        <v-text-field
          v-model="props.day.clockIn"
          type="time"
          label="Clock In"
          dense
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field
          v-model="props.day.clockOut"
          type="time"
          label="Clock Out"
          dense
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="props.day.breakMinutes"
          :items="[{ label: 30, value: 30 }, { label: 45, value: 45 }, { label: 60, value: 60 }]"
          label="Break (min)"
          dense
        ></v-select>
      </v-col>
    </v-row>
  </v-card>
</template>