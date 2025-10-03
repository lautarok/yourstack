"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Timer from "@/components/features/Timer";
import Link from "next/link";
import TransitionWrapper from "@/components/animation/TransitionWrapper";
import { useTransitionStore } from "@/stores/transitionStore";

interface Question {
  id: number;
  text: string;
  codeFragment?: string;
  options: {
    id: number;
    text: string;
  }[];
  correctAnswerId: number;
}

interface ExamData {
  exam: {
    id: string;
    title: string;
    durationMinutes: number;
    approvedLink?: {
      url: string;
      text: string;
      color?: string;
      foregroundColor?: string;
      icon?: string;
    };
    approvalPercentage: number;
  };
  questions: Question[];
}

export default function ExamPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const router = useRouter(),
    [examData, setExamData] = useState<ExamData | null>(null),
    [selectedAnswers, setSelectedAnswers] = useState<{
      [key: number]: number;
    }>({}),
    [currentQuestionIndex, setCurrentQuestionIndex] = useState(0),
    [showResults, setShowResults] = useState(false),
    [isLoading, setIsLoading] = useState(true),
    { examId } = React.use(params);
  const setTransitionPathname = useTransitionStore(
    (state) => state.setPathname,
  );

  const [_exitQuestion, _setExitQuestion] = useState(-1);
  const [_startQuestion, _setStartQuestion] = useState(-1);

  useEffect(() => {
    const loadExam = async () => {
      try {
        const response = await fetch(`/api/exams/${examId}`);
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
  }, [examId, router]);

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleNext = () => {
    if (examData && currentQuestionIndex < examData.questions.length - 1) {
      requestAnimationFrame(() => {
        _setExitQuestion(currentQuestionIndex);
        _setStartQuestion(currentQuestionIndex + 1);
        setTimeout(() => {
          requestAnimationFrame(() => {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            _setStartQuestion(-1)
          });
        }, 1000);
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      requestAnimationFrame(() => {
        _setExitQuestion(currentQuestionIndex)
        _setStartQuestion(currentQuestionIndex - 1);
        setTimeout(() => {
          setCurrentQuestionIndex(currentQuestionIndex - 1);
          _setStartQuestion(-1);
        }, 500)
      })
    } else {
      requestAnimationFrame(() => {
        setTransitionPathname("$nil$")
        setTimeout(() => {
          setTransitionPathname("/")
          router.push("/")
        }, 500)
      })
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleTimeUp = () => {
    setShowResults(true);
  };

  if (isLoading) {
    return null;
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
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 flex justify-center items-center">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl">Resultados del Examen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-6xl font-bold text-primary mb-2">
                  {percentage}%
                </p>
                <p className="text-xl text-muted-foreground">
                  {score} de {examData.questions.length} respuestas correctas
                </p>
                {percentage >= examData.exam.approvalPercentage ? (
                  <>
                    <p className="text-xl text-muted-foreground">(aprobado)</p>
                    {examData.exam.approvedLink ? (
                      <Link
                        style={{
                          backgroundColor:
                            examData.exam.approvedLink.color || "#e0e0e0",
                          color:
                            examData.exam.approvedLink.foregroundColor ||
                            "#000",
                        }}
                        href={examData.exam.approvedLink.url}
                        className="w-fit h-fit px-4 py-3 flex justify-center items-center gap-2 mx-auto mt-4 rounded-2xl"
                      >
                        {examData.exam.approvedLink.icon ? (
                          <div
                            style={{ color: "inherit" }}
                            dangerouslySetInnerHTML={{
                              __html: examData.exam.approvedLink.icon,
                            }}
                          />
                        ) : null}
                        <span style={{ color: "inherit" }}>
                          {examData.exam.approvedLink.text}
                        </span>
                      </Link>
                    ) : null}
                  </>
                ) : (
                  <p className="text-xl text-muted-foreground">(desaprobado)</p>
                )}
              </div>
              <Button onClick={() => router.push("/")} className="mt-4">
                Volver al Inicio
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const isLastQuestion = currentQuestionIndex === examData.questions.length - 1;
  const answeredCount = Object.keys(selectedAnswers).length;
  const currentQuestion = examData.questions[currentQuestionIndex];

  <div className="border-2 border-gray-200"></div>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full h-fit min-h-screen py-12 px-4 items-center justify-center flex-col">
        <TransitionWrapper
          pathname={`/exams/${examId}`}
          className="w-full h-fit flex justify-center lg:justify-center pb-7 lg:pt-12 px-8"
        >
          <Timer
            durationMinutes={examData.exam.durationMinutes}
            onTimeUp={handleTimeUp}
          />
        </TransitionWrapper>
  
        <div className="max-w-4xl mx-auto w-full">
          <div className="mb-8 text-center">
            <TransitionWrapper pathname={`/exams/${examId}`}>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {examData.exam.title}
              </h1>
            </TransitionWrapper>
            <TransitionWrapper pathname={`/exams/${examId}`} duration={300}>
              <p className="text-gray-600">
                Pregunta {currentQuestionIndex + 1} de {examData.questions.length}
              </p>
            </TransitionWrapper>
            <TransitionWrapper
              pathname={`/exams/${examId}`}
              duration={400}
              className="w-full h-fit flex justify-center"
            >
              <div className="mt-4 w-full lg:max-w-[200px] bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(answeredCount / examData.questions.length) * 100}%`,
                  }}
                />
              </div>
            </TransitionWrapper>
          </div>
  
          <TransitionWrapper
            pathname={`/exams/${examId}`}
            duration={300}
          >
            <Card className="relative h-fit">
              {
                examData.questions.map((q, index) => (
                  <div
                    key={"exam-" + q.id}
                    className="overflow-hidden w-full h-fit relative top-0 left-0"
                    style={
                       (_exitQuestion === index || (currentQuestionIndex !== index)) && _startQuestion !== index ? {
                        maxHeight: 0,
                        opacity: 0,
                        transition: "max-height 500ms ease-in-out, opacity 500ms ease-in-out"
                      } : {
                        maxHeight: "250vh",
                        opacity: 1,
                        transition: "max-height 500ms ease-in-out, opacity 500ms 500ms ease-in-out"
                      }
                    }
                  >
                    <div className="w-full h-fit absolute top-0 left-0">
                      <CardHeader>
                        <CardTitle className="text-lg text-center">
                          {q.text}
                        </CardTitle>
                        {q.codeFragment ? (
                          <div className="!mt-6 bg-gray-100 border-[2px] border-gray-200 p-4 rounded-lg">
                            <pre>
                              <code>{q.codeFragment}</code>
                            </pre>
                          </div>
                        ) : null}
                      </CardHeader>
                      <CardContent>
                        <div className="lg:max-w-2xl lg:mx-auto w-full max-w-full flex flex-wrap flex-row gap-4 items-center justify-center">
                          {q.options.map((option, index) => (
                            <TransitionWrapper
                              key={["exma", q.id, option.id].join(" ")}
                              duration={200 + index * 200}
                              pathname={`/exams/${examId}`}
                              className="w-fit h-fit"
                            >
                              <button
                                onClick={() =>
                                  handleAnswerSelect(q.id, option.id)
                                }
                                className={`w-fit h-fit text-left px-3 py-2 rounded-full transition-colors ${
                                  selectedAnswers[q.id] === option.id
                                    ? "border-primary bg-primary text-white"
                                    : "border-border bg-primary/10 hover:border-primary/50"
                                }`}
                              >
                                {option.text}
                              </button>
                            </TransitionWrapper>
                          ))}
                        </div>
                      </CardContent>
                    </div>
                  </div>
                ))
              }
            </Card>
          </TransitionWrapper>
  
          <div className="mt-8 flex justify-between items-center">
            
            <TransitionWrapper pathname={`/exams/${examId}`} duration={300}>
              <Button
                onClick={handlePrevious}
                variant="outline"
              >
                Atrás
              </Button>
            </TransitionWrapper>
  
            {isLastQuestion ? (
              <TransitionWrapper pathname={`/exams/${examId}`} duration={500}>
                <Button
                  onClick={handleSubmit}
                  size="lg"
                  disabled={answeredCount !== examData.questions.length}
                >
                  Enviar Respuestas
                </Button>
              </TransitionWrapper>
            ) : (
              <TransitionWrapper pathname={`/exams/${examId}`} duration={500}>
                <Button
                  disabled={!selectedAnswers[currentQuestion.id]}
                  onClick={handleNext}
                  size="lg"
                >
                  Siguiente
                </Button>
              </TransitionWrapper>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
