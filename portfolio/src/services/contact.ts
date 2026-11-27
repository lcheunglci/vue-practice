export interface ContactPayload {
  name: string
  email: string
  subject: string
  message: string
}

export interface ContactResult {
  ok: boolean
  error?: string
}

/**
 * Sends a contact message.
 *
 * This is a placeholder implementation that simulates a network request.
 * Replace the body with a real API call (e.g. fetch to a form endpoint),
 * keeping the ContactResult contract so the UI stays resilient.
 */
export async function sendContactMessage(payload: ContactPayload): Promise<ContactResult> {
  try {
    // Simulated network latency
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Basic guard so the placeholder behaves like a real endpoint
    if (!payload.name || !payload.email || !payload.message) {
      return { ok: false, error: 'Please fill in all required fields.' }
    }

    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
    }
  }
}