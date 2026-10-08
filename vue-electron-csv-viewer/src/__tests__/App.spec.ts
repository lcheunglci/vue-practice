import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import ReportsList from '../views/ReportsList.vue'

describe('App', () => {
  it('mounts renders properly', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: ReportsList }
      ]
    })
    await router.push('/')
    await router.isReady()
    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.text()).toContain('Reports Insight')
  })
})
