"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Timer from "@/components/features/Timer";
import TransitionWrapper from "@/components/animation/TransitionWrapper";

interface Question {
  id: number;
  text: string;
  options: { id: number; text: string }[];
  correctAnswerId: number;
}

interface ExamData {
  exam: {
    id: string;
    title: string;
    durationMinutes: number;
  };
  questions: Question[];
}

export default function ExamPage({ params }: { params: { examId: string } }) {
  const router = useRouter();
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExam = async () => {
      try {
        const response = await fetch(`/api/exams/${params.examId}`);
        if (!response.ok) {
          throw new Error("Exam not found");
        }
        const data = await response.json();
        setExamData(data);
      } catch (error) {
        console.error("Error loading exam:", error);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    loadExam();
  }, [params.examId, router]);

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleTimeUp = () => {
    setShowResults(true);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 flex items-center justify-center">
        <p className="text-lg text-gray-600">Cargando examen...</p>
      </main>
    );
  }

  if (!examData) {
    return null;
  }

  const calculateScore = () => {
    let correct = 0;
    examData.questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswerId) {
        correct++;
      }
    });
    return correct;
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / examData.questions.length) * 100);

    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <TransitionWrapper>
          <div className="max-w-4xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl">Resultados del Examen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-6xl font-bold text-primary mb-2">{percentage}%</p>
                  <p className="text-xl text-muted-foreground">
                    {score} de {examData.questions.length} respuestas correctas
                  </p>
                </div>
                <Button onClick={() => router.push("/")} className="mt-4">
                  Volver al Inicio
                </Button>
              </CardContent>
            </Card>
          </div>
        </TransitionWrapper>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <Timer durationMinutes={examData.exam.durationMinutes} onTimeUp={handleTimeUp} />
      
      <TransitionWrapper>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {examData.exam.title}
            </h1>
            <p className="text-gray-600">
              {examData.questions.length} preguntas
            </p>
          </div>

          <div className="space-y-6">
            {examData.questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {index + 1}. {question.text}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleAnswerSelect(question.id, option.id)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedAnswers[question.id] === option.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleSubmit}
              size="lg"
              disabled={Object.keys(selectedAnswers).length !== examData.questions.length}
            >
              Enviar Respuestas
            </Button>
          </div>
        </div>
      </TransitionWrapper>
    </main>
  );
}
