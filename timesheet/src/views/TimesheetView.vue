<script setup lang="ts">
import { computed } from 'vue'
import { useTimesheetStore } from '../stores/timesheet'
import DayRow from '../components/DayRow.vue'
import type { DayEntry } from '../stores/timesheet'

const store = useTimesheetStore()

const weekStartLabel = computed(() => {
  const d = new Date(store.timesheet.weekStart + 'T00:00:00')
  return d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})

const prevWeek = computed(() => {
  const d = new Date(store.timesheet.weekStart + 'T00:00:00')
  d.setDate(d.getDate() - 7)
  return toDateKey(d)
})

const nextWeek = computed(() => {
  const d = new Date(store.timesheet.weekStart + 'T00:00:00')
  d.setDate(d.getDate() + 7)
  return toDateKey(d)
})

function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
</script>

<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-card-title-row>
          <v-col cols="4">
            <v-text-field
              v-model="store.timesheet.employeeName"
              label="Employee Name"
              required
              dense
            />
          </v-col>
          <v-col cols="auto">
            <v-btn
              icon
              @click="store.setWeekStart(prevWeek)"
              title="Previous Week"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-spacer />
            <v-chip>{{ weekStartLabel }}</v-chip>
            <v-spacer />
            <v-btn
              icon
              @click="store.setWeekStart(nextWeek)"
              title="Next Week"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-col>
        </v-card-title-row>
      </v-card-title>

      <v-card-text>
        <v-row>
          <DayRow
            v-for="(_, i) in [0, 1, 2, 3, 4]"
            :key="i"
            :index="i"
            :day="store.timesheet.days[i] as DayEntry"
          />
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          :disabled="!store.isComplete"
          @click="store.submit()"
        >
          {{ store.timesheet.status === 'draft' ? 'Submit Timesheet' : 'Submitted' }}
        </v-btn>
        <v-spacer />
        <v-chip
          v-if="store.timesheet.status !== 'draft'"
          color="info"
        >
          {{ store.timesheet.status.charAt(0).toUpperCase() + store.timesheet.status.slice(1) }}
        </v-chip>
        <v-spacer>
          <v-chip
            v-if="store.isComplete"
            color="success"
            density="compact"
          >
            Complete
          </v-chip>
        </v-spacer>
      </v-card-actions>
    </v-card>

    <v-card mt-4>
      <v-card-title>
        <v-chip>Weekly Hours Summary</v-chip>
      </v-card-title>
      <v-card-text>
        <v-row justify="space-between" align="center">
          <v-col>
            <v-chip>Total Hours:</v-chip>
          </v-col>
          <v-col cols="auto">
            <v-chip :color="store.weeklyTotal >= 40 ? 'error' : 'primary'">
              {{ store.weeklyTotal.toFixed(2) }}
            </v-chip>
          </v-col>
          <v-col>
            <v-chip>Regular Hours:</v-chip>
          </v-col>
          <v-col cols="auto">
            <v-chip>{{ (store.weeklyTotal > 40 ? 40 : store.weeklyTotal).toFixed(2) }}</v-chip>
          </v-col>
          <v-col>
            <v-chip>Overtime:</v-chip>
          </v-col>
          <v-col cols="auto">
            <v-chip :color="store.weeklyTotal > 40 ? 'error' : 'primary'">
              {{ Math.max(0, store.weeklyTotal - 40).toFixed(2) }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>