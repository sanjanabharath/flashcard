import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, BarChart2, FolderOpen, Award } from "lucide-react";

interface ProgressStatsProps {
  totalCards: number;
  totalCategories: number;
  studySessionsCount: number;
  averageScore: number;
}

export default function ProgressStats({
  totalCards,
  totalCategories,
  studySessionsCount,
  averageScore,
}: ProgressStatsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-orange-500 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Total Flashcards</CardTitle>
            <CardDescription>Your study collection</CardDescription>
          </div>
          <BookOpen className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCards}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <CardDescription>Across all sessions</CardDescription>
          </div>
          <Award className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>
            {averageScore}%
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Study Sessions</CardTitle>
            <CardDescription>Total practice sessions</CardDescription>
          </div>
          <BarChart2 className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{studySessionsCount}</div>
        </CardContent>
      </Card>
    </>
  );
}