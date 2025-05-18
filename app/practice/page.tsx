"use client";

import { useState, useEffect } from "react";
import Confetti from 'react-confetti';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import StudyCard from "@/components/practice/study-card";
import ResultsCard from "@/components/practice/results-card";
import { Flashcard, Category, StudySession } from "@/lib/types";
import { loadFlashcards, loadCategories, saveStudySession } from "@/lib/storage";

const CelebrationAnimation = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center max-w-md mx-4">
        <div className="animate-bounce text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Congratulations!
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          You've completed your study session!
        </p>
        <div className="flex justify-center mt-4">
          <div className="animate-pulse text-2xl">✨ 🌟 ✨</div>
        </div>
      </div>
    </div>
  );
};

export default function PracticePage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isStudying, setIsStudying] = useState(false);
  const [results, setResults] = useState({ correct: 0, incorrect: 0 });
  const [answeredCards, setAnsweredCards] = useState<Record<string, boolean>>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [showingResults, setShowingResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setFlashcards(loadFlashcards());
    setCategories(loadCategories());
  }, []);

  const startStudySession = () => {
    let cardsToStudy = flashcards;
    if (selectedCategory) {
      cardsToStudy = cardsToStudy.filter(card => card.categoryId === selectedCategory);
    }

    if (cardsToStudy.length === 0) return;

    setStudyCards(cardsToStudy.sort(() => Math.random() - 0.5));
    setCurrentCardIndex(0);
    setIsStudying(true);
    setResults({ correct: 0, incorrect: 0 });
    setAnsweredCards({});
    setShowingResults(false);
  };

  const handleAnswer = (cardId: string, isCorrect: boolean) => {
    if (answeredCards[cardId]) return;

    setAnsweredCards(prev => ({ ...prev, [cardId]: isCorrect }));
    setResults(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
    }));

    const updatedFlashcards = flashcards.map(card =>
      card.id === cardId
        ? {
            ...card,
            lastPracticed: new Date().toISOString(),
            correctCount: isCorrect ? card.correctCount + 1 : card.correctCount,
            incorrectCount: isCorrect ? card.incorrectCount : card.incorrectCount + 1,
          }
        : card
    );

    setFlashcards(updatedFlashcards);
    localStorage.setItem("flashcards", JSON.stringify(updatedFlashcards));
  };

  const finishSession = () => {
    const total = results.correct + results.incorrect;
    if (total === 0) return;

    saveStudySession({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      categoryId: selectedCategory,
      cardsStudied: total,
      correctCount: results.correct,
      incorrectCount: results.incorrect,
      duration: 0,
    });

    setIsStudying(false);
    setShowingResults(true);
    setShowConfetti(true);

    // Hide confetti after 3 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 6000);
  };

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    setShowingResults(true);
  };

  const getCategoryName = (categoryId: string | null) => {
    return categories.find(c => c.id === categoryId)?.name ?? "All Subjects";
  };

  const progress =
    studyCards.length > 0
      ? Math.round(((currentCardIndex + 1) / studyCards.length) * 100)
      : 0;

  return (
    <div className="relative container px-4 md:px-6 py-8 max-w-6xl mx-auto">
      {showConfetti && (
        <div className="fixed inset-0 z-10">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={500}
            gravity={0.2}
            recycle={false}
          />
        </div>
      )}
      {!isStudying ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-8">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Practice Session
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Test your knowledge and improve your learning with a practice session.
            </p>

            {showingResults ? (
              <ResultsCard
                results={results}
                total={Object.keys(answeredCards).length}
                onRestartSession={startStudySession}
              />
            ) : (
              <>
                {categories.length > 0 && (
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Category
                    </label>
                    <Select
                      value={selectedCategory || "all"}
                      onValueChange={value => setSelectedCategory(value === "all" ? null : value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue>All Categories</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                  </div>
                )}

                <Button
                  onClick={startStudySession}
                  className="bg-orange-500 hover:bg-orange-600 w-full"
                  disabled={flashcards.length === 0}
                >
                  Start Practice Session
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center max-w-2xl mx-auto">
          <div className="w-full mb-8 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Practicing: {getCategoryName(selectedCategory)}
              </span>
              <span className="text-sm font-medium">
                {currentCardIndex + 1} of {studyCards.length}
              </span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-200 dark:bg-gray-700" />
          </div>

          {studyCards.length > 0 && currentCardIndex < studyCards.length && (
            <StudyCard
              flashcard={studyCards[currentCardIndex]}
              onAnswer={handleAnswer}
              onFinish={finishSession}
              isLastCard={currentCardIndex === studyCards.length - 1}
              onNext={() => setCurrentCardIndex(prev => prev + 1)}
            />
          )}
        </div>
      )}
    </div>
  );
}
