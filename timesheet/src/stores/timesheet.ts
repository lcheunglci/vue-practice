import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type TimesheetStatus = 'draft' | 'submitted' | 'approved'

export interface DayEntry {
  date: string // YYYY-MM-DD
  clockIn: string // HH:MM
  clockOut: string // HH:MM
  breakMinutes: number
  project: string
  notes: string
}

export interface Timesheet {
  id: string
  employeeName: string
  weekStart: string // YYYY-MM-DD (Monday)
  days: DayEntry[]
  status: TimesheetStatus
}

const toDateKey = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getMonday = (date: Date): Date => {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const day = (monday.getDay() + 6) % 7 // Monday = 0
  monday.setDate(monday.getDate() - day)
  return monday
}

const blankDay = (date: string): DayEntry => ({
  date,
  clockIn: '',
  clockOut: '',
  breakMinutes: 30,
  project: '',
  notes: '',
})

export const useTimesheetStore = defineStore('timesheet', () => {
  const now = new Date()
  const timesheet = ref<Timesheet>({
    id: crypto.randomUUID(),
    employeeName: '',
    weekStart: toDateKey(getMonday(now)),
    days: [0, 1, 2, 3, 4].map((i) => {
      const day = new Date(getMonday(now))
      day.setDate(getMonday(now).getDate() + i)
      return blankDay(toDateKey(day))
    }),
    status: 'draft',
  })

  const setEmployeeName = (name: string) => {
    timesheet.value.employeeName = name
  }

  const setWeekStart = (date: string) => {
    timesheet.value.weekStart = date
    const monday = new Date(date + 'T00:00:00')
    for (let i = 0; i < 5; i++) {
      const dayEntry = timesheet.value.days[i]
      if (dayEntry) {
        const day = new Date(monday)
        day.setDate(monday.getDate() + i)
        dayEntry.date = toDateKey(day)
      }
    }
  }

  const updateDay = (index: number, patch: Partial<DayEntry>) => {
    const day = timesheet.value.days[index]
    if (day) {
      timesheet.value.days[index] = { ...day, ...patch }
    }
  }

  const reset = () => {
    timesheet.value = {
      id: crypto.randomUUID(),
      employeeName: '',
      weekStart: toDateKey(getMonday(new Date())),
      days: [0, 1, 2, 3, 4].map((i) => {
        const day = new Date(getMonday(new Date()))
        day.setDate(getMonday(new Date()).getDate() + i)
        return blankDay(toDateKey(day))
      }),
      status: 'draft',
    }
  }

  const submit = () => {
    timesheet.value.status = 'submitted'
  }

  const dailyHours = computed(() => {
    return timesheet.value.days.map((day) => {
      if (!day.clockIn || !day.clockOut) return 0
      const inParts = day.clockIn.split(':')
      const outParts = day.clockOut.split(':')
      if (inParts.length !== 2 || outParts.length !== 2) return 0
      const inH = Number(inParts[0])
      const inM = Number(inParts[1])
      const outH = Number(outParts[0])
      const outM = Number(outParts[1])
      if (isNaN(inH) || isNaN(inM) || isNaN(outH) || isNaN(outM)) return 0
      const minutesIn = inH * 60 + inM
      const minutesOut = outH * 60 + outM
      let worked = minutesOut - minutesIn - day.breakMinutes
      if (worked < 0) worked = 0
      return Math.round((worked / 60) * 100) / 100
    })
  })

  const weeklyTotal = computed(() => {
    return dailyHours.value.reduce((sum, hours) => sum + hours, 0)
  })

  const isComplete = computed(() => {
    return (
      timesheet.value.employeeName.trim().length > 0 &&
      timesheet.value.weekStart.length > 0 &&
      timesheet.value.days.some((day) => day.clockIn && day.clockOut)
    )
  })

  const dayNames = computed(() => {
    return timesheet.value.days.map((day) => {
      const d = new Date(day.date + 'T00:00:00')
      return d.toLocaleDateString(undefined, { weekday: 'long' })
    })
  })

  const dayDates = computed(() => {
    return timesheet.value.days.map((day) => day.date)
  })

  return {
    timesheet,
    setEmployeeName,
    setWeekStart,
    updateDay,
    reset,
    submit,
    dailyHours,
    weeklyTotal,
    isComplete,
    dayNames,
    dayDates,
  }
})