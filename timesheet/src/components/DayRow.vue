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
  const d = new Date(props.day.date + 'T00:00:00')
  return d.toLocaleDateString(undefined, { weekday: 'long' })
})

const projects = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Other']

function updateField(field: keyof DayEntry, value: string | number) {
  const day = store.timesheet.days[props.index]
  if (day) {
    store.timesheet.days[props.index] = { ...day, [field]: value }
  }
}

const clockOutEarly = computed(() => {
  if (!props.day.clockIn || !props.day.clockOut) return false
  const inParts = props.day.clockIn.split(':').map(Number)
  const outParts = props.day.clockOut.split(':').map(Number)
  if (inParts.length !== 2 || outParts.length !== 2) return false
  const minutesIn = inParts[0] * 60 + inParts[1]
  const minutesOut = outParts[0] * 60 + outParts[1]
  return minutesOut < minutesIn
})
</script>

<template>
  <v-card class="pa-4">
    <div class="font-weight-bold text-caption mb-2">{{ dayName }}</div>

    <v-row justify="space-between" align="center">
      <v-col cols="4">
        <v-select
          :model-value="props.day.project"
          :items="projects"
          label="Project"
          density="comfortable"
          @update:model-value="updateField('project', $event)"
        />
      </v-col>
      <v-col cols="4">
        <v-text-field :model-value="props.day.notes" label="Notes" dense @update:model-value="updateField('notes', $event)" />
      </v-col>
    </v-row>

    <v-row justify="space-between" align="center">
      <v-col cols="4">
        <v-text-field
          :model-value="props.day.clockIn"
          type="time"
          label="Clock In"
          dense
          @update:model-value="updateField('clockIn', $event)"
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          :model-value="props.day.clockOut"
          type="time"
          label="Clock Out"
          dense
          :error="clockOutEarly"
          :error-messages="clockOutEarly ? ['Clock out must be after clock in'] : []"
          @update:model-value="updateField('clockOut', $event)"
        />
      </v-col>
      <v-col cols="4">
        <v-select
          :model-value="props.day.breakMinutes"
          :items="[30, 45, 60]"
          :item-title="(item: number) => `${item} min`"
          label="Break (min)"
          density="compact"
          @update:model-value="updateField('breakMinutes', $event)"
        />
      </v-col>
    </v-row>
  </v-card>
</template>