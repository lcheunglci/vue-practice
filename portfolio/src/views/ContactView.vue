<script setup lang="ts">
import { ref } from 'vue'

import { socialLinks } from '@/config'
import { sendContactMessage } from '@/services/contact'

interface ValidatableForm {
  validate: () => Promise<{ valid: boolean }>
}

const formRef = ref<ValidatableForm | null>(null)

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const rules = {
  required: (v: string) => !!v || 'This field is required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Must be a valid email',
  message: (v: string) => (v && v.length >= 10) || 'Message must be at least 10 characters',
}

const submitting = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const submit = async () => {
  const validation = await formRef.value?.validate()
  if (validation && !validation.valid) return

  submitting.value = true
  snackbar.value = false

  try {
    const result = await sendContactMessage({
      name: form.value.name.trim(),
      email: form.value.email.trim(),
      subject: form.value.subject.trim(),
      message: form.value.message.trim(),
    })

    if (result.ok) {
      snackbarColor.value = 'success'
      snackbarText.value = "Thanks for reaching out! I'll get back to you soon."
      form.value = { name: '', email: '', subject: '', message: '' }
    } else {
      snackbarColor.value = 'error'
      snackbarText.value = result.error ?? 'Something went wrong. Please try again.'
    }
  } catch (err) {
    snackbarColor.value = 'error'
    snackbarText.value =
      err instanceof Error ? err.message : 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
    snackbar.value = true
  }
}
</script>

<template>
  <v-row align="center" justify="center" class="min-vh-100 py-12">
    <v-col cols="12" lg="8" md="10">
      <v-card class="pa-0" outlined>
        <v-card-title class="text-center py-8">
          <h1 class="display-1 font-weight-bold mb-2">Get In Touch</h1>
          <p class="body-1 text-medium-emphasis">
            Have a project in mind? I'd love to hear about it.
          </p>
        </v-card-title>

        <v-card-text class="px-8 pb-8">
          <v-form ref="formRef" @submit.prevent="submit">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.name"
                  label="Your Name"
                  autocomplete="name"
                  :rules="[rules.required]"
                  required
                  prepend-inner-icon="mdi-account"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.email"
                  label="Email Address"
                  autocomplete="email"
                  type="email"
                  :rules="[rules.required, rules.email]"
                  required
                  prepend-inner-icon="mdi-email"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.subject"
                  label="Subject"
                  autocomplete="subject"
                  :rules="[rules.required]"
                  required
                  prepend-inner-icon="mdi-subject"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="form.message"
                  label="Message"
                  autocomplete="off"
                  :rules="[rules.required, rules.message]"
                  required
                  rows="5"
                  prepend-inner-icon="mdi-message"
                />
              </v-col>
              <v-col cols="12" class="text-center">
                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  block
                  :loading="submitting"
                  :disabled="submitting"
                >Send Message</v-btn>
              </v-col>
            </v-row>

            <v-divider class="my-8" />

            <h3 class="text-h6 font-weight-bold mb-4 text-center">Other Ways to Connect</h3>
            <v-row class="justify-center">
              <v-col cols="auto">
                <v-btn
                  variant="outlined"
                  size="large"
                  class="ma-2"
                  :href="socialLinks.github"
                  target="_blank"
                  prepend-icon="mdi-github"
                  aria-label="View my GitHub profile"
                >GitHub</v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  variant="outlined"
                  size="large"
                  class="ma-2"
                  :href="socialLinks.linkedin"
                  target="_blank"
                  prepend-icon="mdi-linkedin"
                  aria-label="View my LinkedIn profile"
                >LinkedIn</v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  variant="outlined"
                  size="large"
                  class="ma-2"
                  :href="`mailto:${socialLinks.email}`"
                  target="_blank"
                  prepend-icon="mdi-email"
                  aria-label="Send email to me"
                >Email</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-snackbar v-model="snackbar" :color="snackbarColor" location="top" timeout="4000" role="status" aria-live="polite">
    {{ snackbarText }}
    <v-btn variant="text" size="large" color="primary" class="mb-2" @click="snackbar = false">Close</v-btn>
  </v-snackbar>
</template>