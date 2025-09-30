import { getExamsIndex } from '@/lib/data-service'
import ExamCard from '@/components/features/ExamCard'
import TransitionWrapper from '@/components/animation/TransitionWrapper'

export default async function HomePage() {
  const exams = await getExamsIndex()

  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4'>
      <TransitionWrapper>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-12'>
            <h1 className='text-4xl font-bold text-gray-900 mb-4'>
              YourStack
            </h1>
            <p className='text-lg text-gray-600'>
              Plataforma de exámenes de TI - Diseño, Programación, Desarrollo Web
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {exams.map((exam) => (
              <ExamCard
                key={exam.id}
                id={exam.id}
                title={exam.title}
                durationMinutes={exam.durationMinutes}
              />
            ))}
          </div>
        </div>
      </TransitionWrapper>
    </main>
  )
}
