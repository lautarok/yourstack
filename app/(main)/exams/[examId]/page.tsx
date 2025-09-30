'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Timer from '@/components/features/Timer'
import TransitionWrapper from '@/components/animation/TransitionWrapper'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'

interface Question {
  id: number
  text: string
  codeFragment?: string
  options: {
    id: number
    text: string
  }[]
  correctAnswerId: number
}

interface ExamData {
  exam: {
    id: string
    title: string
    durationMinutes: number
    approvedLink?: {
      url: string
      text: string
      color?: string
      foregroundColor?: string
      icon?: string
    }
    approvalPercentage: number
  }
  questions: Question[]
}

export default function ExamPage({
  params,
}: {
  params: Promise<{ examId: string }>
}) {
  const router = useRouter(),
    [examData, setExamData] = useState<ExamData | null>(null),
    [selectedAnswers, setSelectedAnswers] = useState<{
      [key: number]: number
    }>({}),
    [currentQuestionIndex, setCurrentQuestionIndex] = useState(0),
    [showResults, setShowResults] = useState(false),
    [isLoading, setIsLoading] = useState(true),
    { examId } = React.use(params)

  useEffect(() => {
    const loadExam = async () => {
      try {
        const response = await fetch(`/api/exams/${examId}`)
        if (!response.ok) {
          throw new Error('Exam not found')
        }
        const data = await response.json()
        setExamData(data)
      } catch (error) {
        console.error('Error loading exam:', error)
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    loadExam()
  }, [examId, router])

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }))
  }

  const handleNext = () => {
    if (examData && currentQuestionIndex < examData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = () => {
    setShowResults(true)
  }

  const handleTimeUp = () => {
    setShowResults(true)
  }

  if (isLoading) {
    return (
      <main className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 flex items-center justify-center'>
        <p className='text-lg text-gray-600'>Cargando examen...</p>
      </main>
    )
  }

  if (!examData) {
    return null
  }

  const calculateScore = () => {
    let correct = 0
    examData.questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswerId) {
        correct++
      }
    })
    return correct
  }

  if (showResults) {
    const score = calculateScore()
    const percentage = Math.round((score / examData.questions.length) * 100)

    return (
      <main className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 flex justify-center items-center'>
        <TransitionWrapper>
          <div className='max-w-4xl mx-auto'>
            <Card className='text-center'>
              <CardHeader>
                <CardTitle className='text-3xl'>
                  Resultados del Examen
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div>
                  <p className='text-6xl font-bold text-primary mb-2'>
                    {percentage}%
                  </p>
                  <p className='text-xl text-muted-foreground'>
                    {score} de {examData.questions.length} respuestas correctas
                  </p>
                  {
                    percentage >= examData.exam.approvalPercentage ? (
                      <>
                        <p className='text-xl text-muted-foreground'>
                          (aprobado)
                        </p>
                        {
                          examData.exam.approvedLink ? (
                            <Link style={{backgroundColor: examData.exam.approvedLink.color || '#e0e0e0', color: examData.exam.approvedLink.foregroundColor || '#000'}} href={examData.exam.approvedLink.url} className='w-fit h-fit px-4 py-3 flex justify-center items-center gap-2 mx-auto mt-4 rounded-2xl'>
                              {
                                examData.exam.approvedLink.icon ? (
                                  <div style={{color: 'inherit'}} dangerouslySetInnerHTML={{ __html: examData.exam.approvedLink.icon }} />
                                ) : null
                              }
                              <span style={{color: 'inherit'}}>{examData.exam.approvedLink.text}</span>
                            </Link>
                          ) : null
                        }
                      </>
                    ) : (
                      <p className='text-xl text-muted-foreground'>
                        (desaprobado)
                      </p>
                    )
                  }
                </div>
                <Button onClick={() => router.push('/')} className='mt-4'>
                  Volver al Inicio
                </Button>
              </CardContent>
            </Card>
          </div>
        </TransitionWrapper>
      </main>
    )
  }

  const isLastQuestion = currentQuestionIndex === examData.questions.length - 1
  const answeredCount = Object.keys(selectedAnswers).length
  const currentQuestion = examData.questions[currentQuestionIndex]

  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 items-center lg:flex justify-center'>
      <div className='w-full h-fit flex justify-center lg:justify-end pb-7 lg:pt-12 px-8 top-0 right-0 lg:fixed'>
        <Timer
          durationMinutes={examData.exam.durationMinutes}
          onTimeUp={handleTimeUp}
        />
      </div>

      <div className='max-w-4xl mx-auto w-full'>
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            {examData.exam.title}
          </h1>
          <p className='text-gray-600'>
            Pregunta {currentQuestionIndex + 1} de {examData.questions.length}
          </p>
          <div className='mt-4 w-full bg-gray-200 rounded-full h-2'>
            <div
              className='bg-primary h-2 rounded-full transition-all duration-300'
              style={{
                width: `${(answeredCount / examData.questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <AnimatePresence mode='wait'>
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>
                  {currentQuestionIndex + 1}. {currentQuestion.text}
                </CardTitle>
                {
                  currentQuestion.codeFragment ? (
                    <div className='!mt-6'>
                      <pre className='bg-gray-100 p-4 rounded-lg'>
                        <code>{currentQuestion.codeFragment}</code>
                      </pre>
                    </div>
                  ) : null
                }
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() =>
                        handleAnswerSelect(currentQuestion.id, option.id)
                      }
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedAnswers[currentQuestion.id] === option.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className='mt-8 flex justify-between items-center'>
          {
            currentQuestionIndex === 0 ? (
              <Link href='/'>
                <Button
                 variant='outline'
                 disabled={currentQuestionIndex > 0}
                >
                  Volver al inicio
                </Button>
              </Link>
            ) : (
              <Button
                onClick={handlePrevious}
                variant='outline'
                disabled={currentQuestionIndex === 0}
              >
                Anterior
              </Button>
            )
          }

          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              size='lg'
              disabled={answeredCount !== examData.questions.length}
            >
              Enviar Respuestas
            </Button>
          ) : (
            <Button disabled={!selectedAnswers[currentQuestion.id]} onClick={handleNext} size='lg'>
              Siguiente
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}
