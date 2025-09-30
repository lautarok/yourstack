import { promises as fs } from "fs";
import path from "path";

export interface ExamIndex {
  id: string;
  title: string;
  durationMinutes: number;
  dataFilePath: string;
}

export interface Question {
  id: number;
  text: string;
  options: { id: number; text: string }[];
  correctAnswerId: number;
}

export interface ExamData {
  questions: Question[];
}

export async function getExamsIndex(): Promise<ExamIndex[]> {
  try {
    const filePath = path.join(process.cwd(), "data", "exams-index.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error loading exams index:", error);
    return [];
  }
}

export async function getExamById(examId: string): Promise<{ exam: ExamIndex; data: ExamData } | null> {
  try {
    const exams = await getExamsIndex();
    const exam = exams.find((e) => e.id === examId);
    
    if (!exam) {
      return null;
    }

    const filePath = path.join(process.cwd(), exam.dataFilePath);
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data: ExamData = JSON.parse(fileContent);

    return { exam, data };
  } catch (error) {
    console.error(`Error loading exam ${examId}:`, error);
    return null;
  }
}
