"use client"

import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import TransitionWrapper from "@/components/animation/TransitionWrapper";
import { useRouter } from "next/navigation";
import React, { MouseEventHandler } from "react";
import { useTransitionStore } from "@/stores/transitionStore";

interface ExamCardProps {
  id: string;
  title: string;
  durationMinutes: number;
  icon: React.ReactNode;
  isVisible?: boolean;
  index?: number;
  examLength: number;
}

export default function ExamCard({
  id,
  title,
  durationMinutes,
  icon,
  index = 0,
  examLength
}: ExamCardProps) {
  const router = useRouter(),
      setTransitionPathname = useTransitionStore(state => state.setPathname)
  
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    requestAnimationFrame(() => {
      setTransitionPathname("$nil$");
      setTimeout(() => {
        router.push(`/exams/${id}`);
      }, ((examLength - 1) * 200) + 200)
    })
  }
  
  return (
    <TransitionWrapper pathname="/" duration={200 + index * 200}>
      <Link href={`/exams/${id}`} onClick={handleClick}>
        <Card className="md:hover:shadow-[0_0_0_0.3rem] shadow-none !shadow-primary/20 transition-shadow !bg-primary/10 text-center">
          <CardHeader className="flex justify-center items-center">
            {icon}
            <CardTitle className="!mt-4">{title}</CardTitle>
            <CardDescription className="!text-black/80">
              Duración: {durationMinutes} minutos
            </CardDescription>
          </CardHeader>
        </Card>
      </Link>
    </TransitionWrapper>
  );
}
