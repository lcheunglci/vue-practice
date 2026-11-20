<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Product, ProductForm } from '@/types'

const props = defineProps<{
  product?: Product | null
}>()

const emit = defineEmits<{
  save: [form: ProductForm]
}>()

const open = defineModel<boolean>({ default: false })

const storeOptions = ['Amazon', 'Best Buy', 'Target', 'Walmart', 'Other']

function blankForm(): ProductForm {
  return { name: '', store: 'Amazon', url: '', targetPrice: 0, notes: '' }
}

const form = ref<ProductForm>(blankForm())

const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)

const isEdit = computed(() => !!props.product)

watch(open, (isOpen) => {
  if (!isOpen) return
  if (props.product) {
    form.value = {
      name: props.product.name,
      store: props.product.store,
      url: props.product.url,
      targetPrice: props.product.targetPrice,
      notes: props.product.notes ?? '',
    }
  } else {
    form.value = blankForm()
  }
})

const required = (v: unknown) =>
  (v !== null && v !== undefined && String(v).trim() !== '') || 'This field is required'
const isUrl = (v: string) => /^https?:\/\/.+/i.test(v) || 'Enter a valid URL starting with http(s)://'
const isPositive = (v: number) => (typeof v === 'number' && v > 0) || 'Enter a price greater than 0'

const nameRules = [required]
const urlRules = [required, isUrl]
const priceRules = [isPositive]

async function submit() {
  const result = await formRef.value?.validate()
  if (result && !result.valid) return
  emit('save', { ...form.value, targetPrice: Number(form.value.targetPrice) })
  open.value = false
}
</script>

<template>
  <v-dialog v-model="open" max-width="560" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">{{ isEdit ? 'mdi-pencil' : 'mdi-plus-circle' }}</v-icon>
        {{ isEdit ? 'Edit product' : 'Add product to watchlist' }}
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="open = false" />
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef" @submit.prevent="submit">
          <v-text-field
            v-model="form.name"
            label="Product name"
            placeholder="e.g. Sony WH-1000XM5 Headphones"
            :rules="nameRules"
            prepend-inner-icon="mdi-tag-outline"
            autofocus
          />

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-select
                v-model="form.store"
                :items="storeOptions"
                label="Store"
                :rules="nameRules"
                prepend-inner-icon="mdi-storefront-outline"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="form.targetPrice"
                label="Target price"
                type="number"
                min="0"
                step="0.01"
                prefix="$"
                :rules="priceRules"
                prepend-inner-icon="mdi-cash-multiple"
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="form.url"
            label="Product URL"
            placeholder="https://www.amazon.com/dp/..."
            :rules="urlRules"
            prepend-inner-icon="mdi-link-variant"
          />

          <v-textarea
            v-model="form.notes"
            label="Notes (optional)"
            rows="2"
            auto-grow
            prepend-inner-icon="mdi-note-text-outline"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="open = false">Cancel</v-btn>
        <v-btn color="primary" :prepend-icon="isEdit ? 'mdi-content-save' : 'mdi-plus'" @click="submit">
          {{ isEdit ? 'Save changes' : 'Add product' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
