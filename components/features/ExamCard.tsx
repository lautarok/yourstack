'use client'

import Link from 'next/link'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { motion } from 'framer-motion'

interface ExamCardProps {
  id: string
  title: string
  durationMinutes: number
  icon?: React.ReactNode
  index?: number
}

export default function ExamCard({
  id,
  title,
  durationMinutes,
  icon,
  index = 0
}: ExamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ 
        duration: 0.5, 
        ease: 'easeOut',
        delay: index * 0.1
      }}
    >
      <Link href={`/exams/${id}`}>
        <Card className='hover:shadow-[0_0_0_0.3rem] shadow-none !shadow-primary/20 transition-shadow duration-200 !bg-primary/10 text-center'>
          <CardHeader className='flex justify-center items-center'>
            {icon}
            <CardTitle className='!mt-4'>{title}</CardTitle>
            <CardDescription className='!text-black/80'>
              Duración: {durationMinutes} minutos
            </CardDescription>
          </CardHeader>
        </Card>
      </Link>
    </motion.div>
  )
}
