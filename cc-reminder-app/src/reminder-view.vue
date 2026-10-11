<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { VMenu, VBtn, VIcon, VTextField, VCard, VCardTitle, VCardText, VCardActions, VList, VListItem, VListItemTitle, VListItemSubtitle, VDivider, VAlert } from 'vuetify/components'
import { useRouter } from 'vue-router'

const router = useRouter()

// State
const showReminderModal = ref(false)
const selectedDate = ref(new Date())
const selectedDateStr = ref(new Date().toISOString().split('T')[0])
const reminderDescription = ref('')
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
import { watch } from 'vue'
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
}

const closeReminderModal = () => {
  showReminderModal.value = false
}

const addReminder = () => {
  if (!reminderDescription.value.trim() || !selectedDateStr.value) return
  
  const newReminder = {
    id: Date.now().toString(),
    date: new Date(selectedDateStr.value + 'T00:00:00').toISOString(),
    description: reminderDescription.value.trim(),
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
</script>

<template>
  <div>
    <v-alert
      v-if="overdueReminders.length > 0"
      type="warning"
      density="compact"
      class="mb-4"
    >
      You have <strong>{{ overdueReminders.length }}</strong> overdue reminder(s)!
      <template #actions>
        <v-btn text color="error" @click="overdueReminders.forEach(r => deleteReminder(r.id))">
          Clear All
        </v-btn>
      </template>
    </v-alert>
    
    <v-card class="mb-4">
      <v-card-title>
        Upcoming Reminders (Next 7 Days)
        <v-spacer />
        <v-btn icon @click="openReminderModal">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      
      <v-card-text>
        <v-list>
          <v-list-item-group>
            <v-list-item
              v-for="reminder in upcomingReminders"
              :key="reminder.id"
              prepend-icon="mdi-alert-circle"
              class="mb-2"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ reminder.description }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatDate(reminder.date) }} at {{ formatTime(reminder.date) }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon @click.stop="deleteReminder(reminder.id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            
            <v-list-item v-if="upcomingReminders.length === 0">
              <v-list-item-content>
                <v-list-item-title>No upcoming reminders</v-list-item-title>
                <v-list-item-subtitle>
                  Click the + button to add a new reminder
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card-text>
    </v-card>
    
    <!-- Add Reminder Modal -->
    <v-menu
      v-model="showReminderModal"
      :close-on-content-click="false"
      transition="scale-y-reverse"
      offset-y
      min-width="290px"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          color="primary"
          class="mb-4"
        >
          Add Reminder
        </v-btn>
      </template>
      
      <v-card>
        <v-card-title>
          <span class="text-h6">Add New Reminder</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <v-label for="reminder-date">Date</v-label>
              <v-text-field
                v-model="selectedDateStr"
                type="date"
                label="Select due date"
                prepend-inner-icon="mdi-calendar"
                :min="new Date().toISOString().split('T')[0]"
              />
            </v-col>
            
            <v-col cols="12" sm="6">
              <v-label for="reminder-description">Description</v-label>
              <v-text-field
                v-model="reminderDescription"
                label="Reminder description"
                placeholder="e.g., Credit card bill due"
                clearable
              />
            </v-col>
          </v-row>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="closeReminderModal"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="addReminder"
          >
            Add Reminder
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<style scoped>
</style>
