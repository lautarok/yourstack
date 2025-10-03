import { getExamsIndex } from '@/lib/data-service'
import ExamCard from '@/components/features/ExamCard'
import * as Icon from 'akar-icons'
import TransitionWrapper from '@/components/animation/TransitionWrapper'

export default async function HomePage() {
  const exams = await getExamsIndex()

  return (
    <main className='min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4'>
      <div className='max-w-5xl mx-auto'>
        <div className='text-center mb-12'>
          <TransitionWrapper pathname='/'>
            <h1 className='text-4xl font-bold text-gray-900 mb-4'>
              YourStack
            </h1>
          </TransitionWrapper>
          <TransitionWrapper pathname='/'>
            <p className='text-lg text-gray-600'>
              Plataforma de exámenes de TI - Diseño, Programación, Desarrollo Web
            </p>
          </TransitionWrapper>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {exams.map((exam, index) => (
            <ExamCard
              key={exam.id}
              id={exam.id}
              title={exam.title}
              durationMinutes={exam.durationMinutes}
              index={index}
              examLength={exams.length}
              icon={
                exam.icon === "js" ? <Icon.JavascriptFill size={42} />
                  : exam.icon === "css" ? <Icon.CssFill size={42} />
                  : exam.icon === "react" ? <Icon.ReactFill size={42} />
                  : <Icon.QuestionFill size={66} />
              }
            />
          ))}
        </div>
      </div>
    </main>
  )
}
