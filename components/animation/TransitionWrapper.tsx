'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode } from 'react'

interface TransitionWrapperProps {
  children: ReactNode
  className?: string
}

export default function TransitionWrapper({ children, className = '' }: TransitionWrapperProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
