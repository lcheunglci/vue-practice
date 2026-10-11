<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
import { Chart } from 'vue-chartjs'

// Initialize Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
)

const router = useRouter()

// State
const csvData = ref<any[]>([])
const spendingCategories = ref<Record<string, number>>({})
const loading = ref(true)

// Sample CSV data for demonstration
const sampleData = `Date,Description,Amount,Category
2026-01-01,Groceries,150.50,Food
2026-01-05,Utilities,89.99,Utilities
2026-01-10,Entertainment,45.00,Entertainment
2026-01-15,Groceries,180.00,Food
2026-01-20,Medical,120.75,Health
2026-01-25,Bill Payment,350.00,Finance
2026-01-30,Groceries,120.00,Food
2026-02-05,Utilities,92.50,Utilities
2026-02-10,Dining Out,75.25,Dining
2026-02-15,Entertainment,60.00,Entertainment
2026-02-20,Groceries,200.00,Food
2026-02-25,Medical,80.50,Health
2026-02-28,Bill Payment,400.00,Finance
2026-03-05,Groceries,150.00,Food
2026-03-10,Entertainment,55.00,Entertainment
2026-03-15,Utilities,88.99,Utilities
2026-03-20,Transportation,30.00,Transport
2026-03-25,Dining Out,85.50,Dining
2026-03-30,Groceries,175.00,Food
2026-04-01,Medical,95.75,Health
2026-04-05,Bill Payment,450.00,Finance
2026-04-10,Entertainment,40.00,Entertainment
2026-04-15,Groceries,130.00,Food
2026-04-20,Utilities,85.00,Utilities
2026-04-25,Transportation,45.00,Transport
2026-04-30,Groceries,160.00,Food
2026-05-05,Medical,110.25,Health
2026-05-10,Bill Payment,500.00,Finance
2026-05-15,Entertainment,65.00,Entertainment
2026-05-20,Groceries,140.00,Food
2026-05-25,Utilities,95.50,Utilities
2026-05-30,Groceries,185.00,Food
2026-06-04,Medical,105.75,Health
2026-06-09,Bill Payment,550.00,Finance
2026-06-14,Entertainment,70.00,Entertainment
2026-06-19,Groceries,155.00,Food
2026-06-24,Utilities,98.50,Utilities
2026-06-29,Groceries,165.00,Food
2026-07-04,Medical,115.25,Health
2026-07-09,Bill Payment,600.00,Finance
2026-07-14,Entertainment,80.00,Entertainment
2026-07-19,Groceries,170.00,Food
2026-07-24,Utilities,102.50,Utilities
2026-07-29,Groceries,190.00,Food
2026-08-03,Medical,125.75,Health
2026-08-08,Bill Payment,650.00,Finance
2026-08-13,Entertainment,90.00,Entertainment
2026-08-18,Groceries,175.00,Food
2026-08-23,Utilities,105.50,Utilities
2026-08-28,Groceries,180.00,Food
2026-09-02,Medical,135.25,Health
2026-09-07,Bill Payment,700.00,Finance
2026-09-12,Entertainment,100.00,Entertainment
2026-09-17,Groceries,185.00,Food
2026-09-22,Utilities,110.50,Utilities
2026-09-27,Groceries,195.00,Food
2026-10-02,Medical,145.75,Health
2026-10-07,Bill Payment,750.00,Finance
2026-10-12,Entertainment,110.00,Entertainment
2026-10-17,Groceries,205.00,Food
2026-10-22,Utilities,115.50,Utilities
2026-10-27,Groceries,210.00,Food
2026-11-01,Medical,155.25,Health
2026-11-06,Bill Payment,800.00,Finance
2026-11-11,Entertainment,120.00,Entertainment
2026-11-16,Groceries,215.00,Food
2026-11-21,Utilities,120.50,Utilities
2026-11-26,Groceries,220.00,Food
2026-12-01,Medical,165.75,Health
2026-12-06,Bill Payment,850.00,Finance
2026-12-11,Entertainment,130.00,Entertainment
2026-12-16,Groceries,225.00,Food
2026-12-21,Utilities,125.50,Utilities
2026-12-26,Groceries,230.00,Food
2026-12-31,Medical,175.25,Health
2026-12-31,Bill Payment,900.00,Finance
2026-12-31,Entertainment,140.00,Entertainment
2026-12-31,Groceries,235.00,Food
2026-12-31,Utilities,130.50,Utilities
2026-12-31,Transportation,50.00,Transport
2026-12-31,Dining Out,95.75,Dining
2026-12-31,Other,75.00,Other
`

// Process and load CSV data
const loadCSV = () => {
  loading.value = true
  // Simulate loading
  setTimeout(() => {
    const rows = sampleData.split('\n').slice(1)
    const data = rows.map(row => {
      const values = row.split(',')
      return {
        date: values[0],
        description: values[1],
        amount: parseFloat(values[2]),
        category: values[3]
      }
    })
    
    csvData.value = data
    
    // Aggregate spending by category
    data.forEach(row => {
      if (row.category) {
        spendingCategories[row.category] = (spendingCategories[row.category] || 0) + row.amount
      }
    })
    
    loading.value = false
  }, 500)
}

// Chart data and methods
const spendingChart = ref(null)
const pieData = ref({
  labels: [],
  datasets: []
})

const renderPieChart = () => {
  if (!csvData.value || csvData.value.length === 0) return
  
  const categories = Object.keys(spendingCategories)
  const total = Object.values(spendingCategories).reduce((sum, v) => sum + v, 0)
  
  pieData.value = {
    labels: categories,
    datasets: [
      {
        backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16', '#F4E03D', '#FCA31D'],
        data: categories.map(cat => spendingCategories[cat] || 0)
      }
    ]
  }
}

const summary = ref('')

// Load data on mount
onMounted(() => {
  loadCSV()
  setTimeout(() => {
    renderPieChart()
  }, 1000)
})

// Methods
const showSummary = () => {
  summary.value = 'Total Spending: $' + Object.values(spendingCategories).reduce((sum, v) => sum + v, 0).toFixed(2)
  renderPieChart()
}

const refreshChart = () => {
  renderPieChart()
}

const closeBudgetView = () => {
  // Reset state
  csvData.value = []
  spendingCategories.value = {}
  summary.value = ''
  pieData.value = { labels: [], datasets: [] }
  loadCSV()
}

const openBudgetView = () => {
  showSummary()
}

const downloadCSV = () => {
  if (csvData.value.length === 0) return
  const csv = 'Date,Description,Amount,Category\n' + csvData.value.map(row => row.date + ',' + row.description + ',' + row.amount + ',' + row.category).join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'budget.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<template>
  <v-container class="mt-6">
    <v-card class="mb-6">
      <v-card-header>
        <v-card-title>Budget Overview</v-card-title>
      </v-card-header>
      <v-card-text>
        <div class="d-flex justify-space-around flex-wrap">
          <v-card class="mb-4 pa-4" width="200">
            <h3 class="text-h6 font-weight-light mb-2">Total Spending</h3>
            <p class="text-h4 font-weight-bold text-primary">
              ${{ Object.values(spendingCategories).reduce((sum, v) => sum + v, 0).toFixed(2) }}
            </p>
          </v-card>
          
          <v-card class="mb-4 pa-4" width="200">
            <h3 class="text-h6 font-weight-light mb-2">Categories</h3>
            <p class="text-h4 font-weight-bold text-success">
              {{ Object.keys(spendingCategories).length }}
            </p>
          </v-card>
          
          <v-card class="mb-4 pa-4" width="200">
            <h3 class="text-h6 font-weight-light mb-2">Transactions</h3>
            <p class="text-h4 font-weight-bold text-info">
              {{ csvData.length }}
            </p>
          </v-card>
        </div>
        
        <div class="pie-chart-wrapper mt-6">
          <v-card variant="outlined" class="pa-4 text-center">
            <h3 class="text-h6 mb-4">Spending by Category</h3>
            <div class="d-flex flex-wrap justify-center gap-3">
              <v-chip
                v-for="(amount, category) in spendingCategories"
                :key="category"
                color="primary"
                variant="outlined"
                class="ma-1"
              >
                {{ category }}: ${{ amount.toFixed(2) }}
              </v-chip>
            </div>
          </v-card>
        </div>
        
        <v-card class="mt-6">
          <v-card-title>Spending Categories</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="(amount, category) in spendingCategories"
                :key="category"
              >
                <v-list-item-title>{{ category }}</v-list-item-title>
                <v-list-item-subtitle>
                  ${{ amount.toFixed(2) }} ({{
                    ((amount / Object.values(spendingCategories).reduce((sum, v) => sum + v, 0)) * 100).toFixed(1)
                  }}%)
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-card-text>
      
      <v-card-actions>
        <v-btn color="primary" @click="downloadCSV()">Download CSV</v-btn>
        <v-btn variant="outlined" @click="refreshChart()">Refresh Chart</v-btn>
      </v-card-actions>
    </v-card>
    
    <v-card class="mt-6">
      <v-card-header>
        <v-card-title>Spending Breakdown by Date</v-card-title>
      </v-card-header>
      <v-card-text>
        <v-table density="compact">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in csvData" :key="index">
              <td>{{ row.date }}</td>
              <td>{{ row.description }}</td>
              <td class="font-weight-medium" :class="{
                'text-green-600': row.amount < 0,
                'text-red-600': row.amount > 0
              }">
                ${{ Math.abs(row.amount).toFixed(2) }}
              </td>
              <td>
                <v-chip size="small">{{ row.category }}</v-chip>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
  .pie-chart-wrapper {
    position: relative;
    height: 300px;
    width: 100%;
  }
  
  .spacing-card {
    margin-bottom: 1rem;
  }
</style>
