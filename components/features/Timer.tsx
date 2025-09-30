'use client'

import { useEffect, useState } from 'react'

interface TimerProps {
  durationMinutes: number
  onTimeUp: () => void
}

export default function Timer({ durationMinutes, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60)

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onTimeUp])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const isWarning = timeLeft <= 300
  const isCritical = timeLeft <= 60

  return (
    <div
      className={`fixed top-4 right-4 px-6 py-3 rounded-lg font-mono text-lg font-semibold shadow-lg ${
        isCritical
          ? 'bg-red-100 text-red-700 border-2 border-red-300'
          : isWarning
          ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
          : 'bg-blue-100 text-blue-700 border-2 border-blue-300'
      }`}
    >
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  )
}
