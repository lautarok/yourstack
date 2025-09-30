import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import TransitionWrapper from "@/components/animation/TransitionWrapper";

interface ExamCardProps {
  id: string;
  title: string;
  durationMinutes: number;
}

export default function ExamCard({ id, title, durationMinutes }: ExamCardProps) {
  return (
    <TransitionWrapper>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Duración: {durationMinutes} minutos</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Pon a prueba tus conocimientos con este examen cronometrado.
          </p>
        </CardContent>
        <CardFooter>
          <Link href={`/exams/${id}`} className="w-full">
            <Button className="w-full">Comenzar Examen</Button>
          </Link>
        </CardFooter>
      </Card>
    </TransitionWrapper>
  );
}
