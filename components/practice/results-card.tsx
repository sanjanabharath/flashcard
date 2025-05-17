import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Repeat, Trophy, BarChart2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface ResultsCardProps {
  results: {
    correct: number;
    incorrect: number;
  };
  total: number;
  onRestartSession: () => void;
}

export default function ResultsCard({ 
  results, 
  total,
  onRestartSession 
}: ResultsCardProps) {
  const percentCorrect = total > 0 ? Math.round((results.correct / total) * 100) : 0;
  
  // Determine performance level and message
  let performanceLevel = 'Needs Practice';
  let message = 'Keep practicing to improve your results!';
  
  if (percentCorrect >= 90) {
    performanceLevel = 'Excellent!';
    message = 'Outstanding job! You\'ve mastered this material.';
  } else if (percentCorrect >= 70) {
    performanceLevel = 'Good Job!';
    message = 'Well done! You\'re making great progress.';
  } else if (percentCorrect >= 50) {
    performanceLevel = 'Getting There';
    message = 'You\'re on the right track! Keep practicing.';
  }

  return (
    <Card className="w-full border-2 border-orange-200 dark:border-orange-800">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold">Practice Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative mb-6">
            <div className="flex items-center justify-center w-32 h-32 rounded-full border-8 border-orange-100 dark:border-orange-900">
              <Trophy className={`h-12 w-12 ${
                percentCorrect >= 70 ? 'text-orange-500' : 'text-gray-400'
              }`} />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              {performanceLevel}
            </div>
          </div>
          
          <h3 className="text-xl font-medium text-center mb-1">
            {results.correct} of {total} Correct
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
            {message}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Score: {percentCorrect}%</span>
            </div>
            <Progress value={percentCorrect} className="h-3" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{results.correct}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Correct</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{results.incorrect}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Incorrect</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button 
            onClick={onRestartSession}
            variant="outline" 
            className="w-full"
          >
            <Repeat className="h-4 w-4 mr-2" />
            Practice Again
          </Button>
          <Button 
            asChild
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            <Link href="/progress">
              <BarChart2 className="h-4 w-4 mr-2" />
              View Progress
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}