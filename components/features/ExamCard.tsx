import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import TransitionWrapper from "@/components/animation/TransitionWrapper";

interface ExamCardProps {
  id: string;
  title: string;
  durationMinutes: number;
  icon?: React.ReactNode;
  isVisible?: boolean
}

export default function ExamCard({
  id,
  title,
  durationMinutes,
  icon
}: ExamCardProps) {
  return (
    <TransitionWrapper>
      <Link href={`/exams/${id}`}>
        <Card className="hover:shadow-[0_0_0_0.3rem] shadow-none !shadow-primary/20 transition-shadow duration-200 !bg-primary/10 text-center">
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
