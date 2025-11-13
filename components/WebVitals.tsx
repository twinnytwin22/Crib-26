'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Only log in development, disable in production for now to improve performance
    if (process.env.NODE_ENV === 'development') {
      console.log(metric)
    }
  })

  return null
}
