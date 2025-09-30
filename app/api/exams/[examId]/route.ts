import { NextRequest, NextResponse } from 'next/server'
import { getExamById } from '@/lib/data-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { examId: string } }
) {
  const result = await getExamById(params.examId)

  if (!result) {
    return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
  }

  return NextResponse.json({
    exam: result.exam,
    questions: result.data.questions,
  })
}
