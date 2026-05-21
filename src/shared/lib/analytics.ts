export const GA_ID = 'G-64FZMF8HTP'

declare global {
  interface Window {
    gtag: (command: 'event' | 'config' | 'js' | 'set', ...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

function gtag(command: 'event' | 'config' | 'js' | 'set', ...args: unknown[]) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag(command, ...args)
}

// Auth
export const analytics = {
  login() {
    gtag('event', 'login', { method: 'email' })
  },

  signUp() {
    gtag('event', 'sign_up', { method: 'email' })
  },

  logout() {
    gtag('event', 'logout')
  },

  // Wizard
  wizardStart() {
    gtag('event', 'begin_checkout')
  },

  wizardStepComplete(stepNumber: number, stepName: string) {
    gtag('event', 'wizard_step_complete', {
      step_number: stepNumber,
      step_name: stepName,
    })
  },

  productSelected(productName: string, riskLevel: string) {
    gtag('event', 'select_item', {
      item_name: productName,
      item_category: riskLevel,
    })
  },

  contractSigned(params: {
    transactionId: string
    productName: string
    amount: number
    currency: string
  }) {
    gtag('event', 'purchase', {
      transaction_id: params.transactionId,
      value: params.amount,
      currency: params.currency,
      items: [{ item_name: params.productName }],
    })
  },
}
