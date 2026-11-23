import { describe, expect, test } from 'vitest'
import { socialLinks } from '@/config'

describe('socialLinks config', () => {
  test('should have required properties', () => {
    expect(socialLinks).toHaveProperty('github')
    expect(socialLinks).toHaveProperty('linkedin')
    expect(socialLinks).toHaveProperty('email')
  })

  test('github should be a valid URL', () => {
    expect(socialLinks.github).toMatch(/^https?:\/\//)
  })

  test('linkedin should be a valid URL', () => {
    expect(socialLinks.linkedin).toMatch(/^https?:\/\//)
  })

  test('email should be a valid email format', () => {
    expect(socialLinks.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  })
})