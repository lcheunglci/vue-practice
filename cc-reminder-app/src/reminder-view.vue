<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { VMenu, VBtn, VIcon, VTextField, VCard, VCardTitle, VCardText, VCardActions, VList, VListItem, VListItemTitle, VListItemSubtitle, VDivider, VAlert } from 'vuetify/components'
import { useRouter } from 'vue-router'

const router = useRouter()

// State
const showReminderModal = ref(false)
const selectedDate = ref(new Date())
const selectedDateStr = ref(new Date().toISOString().split('T')[0])
const reminderDescription = ref('')
const formError = ref('')

const reminders = ref([])

// Local storage key
const REMINDER_STORAGE_KEY = 'cc-reminders'

// Load reminders from localStorage on mount
onMounted(() => {
  const saved = localStorage.getItem(REMINDER_STORAGE_KEY)
  if (saved) {
    try {
      reminders.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse reminders from localStorage', e)
    }
  }
})

// Save reminders to localStorage
const saveReminders = () => {
  localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(reminders.value))
}

// Watch for changes and save
watch(reminders, saveReminders, { deep: true })

// Computed properties
const upcomingReminders = computed(() => {
  const now = new Date()
  const nextWeek = new Date(now)
  nextWeek.setDate(now.getDate() + 7)
  
  return reminders.value
    .filter(r => {
      const reminderDate = new Date(r.date)
      return reminderDate >= now && reminderDate <= nextWeek
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
})

const overdueReminders = computed(() => {
  const now = new Date()
  return reminders.value
    .filter(r => {
      const reminderDate = new Date(r.date)
      return reminderDate < now
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
})

// Methods
const openReminderModal = () => {
  showReminderModal.value = true
  // Reset form
  selectedDate.value = new Date()
  selectedDateStr.value = new Date().toISOString().split('T')[0]
  reminderDescription.value = ''
  formError.value = ''
}

const closeReminderModal = () => {
  showReminderModal.value = false
}

const addReminder = () => {
  const description = reminderDescription.value.trim()
  const dateStr = selectedDateStr.value

  if (!description) {
    formError.value = 'Please enter a reminder description.'
    return
  }

  if (!selectedDateStr.value) {
    formError.value = 'Please select a due date.'
    return
  }

  const newReminder = {
    id: Date.now().toString(),
    date: new Date(dateStr + 'T00:00:00').toISOString(),
    description: description,
    createdAt: new Date().toISOString()
  }

  reminders.value.push(newReminder)
  closeReminderModal()
}

const deleteReminder = (id) => {
  reminders.value = reminders.value.filter(r => r.id !== id)
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Keyboard shortcuts: Ctrl+N to add reminder, Escape to close modal
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 'n') {
    openReminderModal()
  } else if (e.key === 'Escape' && showReminderModal.value) {
    closeReminderModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>