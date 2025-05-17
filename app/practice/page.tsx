"use client";

import { useState, useEffect } from "react";
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

export default function PracticePage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isStudying, setIsStudying] = useState(false);
  const [results, setResults] = useState<{correct: number, incorrect: number}>({ correct: 0, incorrect: 0 });
  const [answeredCards, setAnsweredCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const storedFlashcards = loadFlashcards();
    const storedCategories = loadCategories();
    setFlashcards(storedFlashcards);
    setCategories(storedCategories);
  }, []);

  const startStudySession = () => {
    let cardsToStudy = [...flashcards];
    
    if (selectedCategory) {
      cardsToStudy = cardsToStudy.filter(card => card.categoryId === selectedCategory);
    }
    
    // Shuffle the cards
    cardsToStudy = cardsToStudy.sort(() => Math.random() - 0.5);
    
    setStudyCards(cardsToStudy);
    setCurrentCardIndex(0);
    setIsStudying(true);
    setResults({ correct: 0, incorrect: 0 });
    setAnsweredCards({});
  };

  const handleAnswer = (cardId: string, isCorrect: boolean) => {
    setAnsweredCards(prev => ({
      ...prev,
      [cardId]: isCorrect
    }));

    setResults(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: isCorrect ? prev.incorrect : prev.incorrect + 1
    }));

    // Update the flashcard stats in localStorage
    const updatedFlashcards = flashcards.map(card => {
      if (card.id === cardId) {
        return {
          ...card,
          lastPracticed: new Date().toISOString(),
          correctCount: isCorrect ? card.correctCount + 1 : card.correctCount,
          incorrectCount: isCorrect ? card.incorrectCount : card.incorrectCount + 1
        };
      }
      return card;
    });

    setFlashcards(updatedFlashcards);
    localStorage.setItem('flashcards', JSON.stringify(updatedFlashcards));

    // Move to the next card
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const finishSession = () => {
    const totalAnswered = results.correct + results.incorrect;
    
    if (totalAnswered > 0) {
      // Create and save study session record
      const session: StudySession = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        categoryId: selectedCategory,
        cardsStudied: totalAnswered,
        correctCount: results.correct,
        incorrectCount: results.incorrect,
        duration: 0, // In a real app, would track actual duration
      };
      
      saveStudySession(session);
    }
    
    setIsStudying(false);
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return "All Subjects";
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : "All Subjects";
  };

  const progress = studyCards.length > 0 
    ? Math.round(((currentCardIndex + 1) / studyCards.length) * 100) 
    : 0;

  return (
    <div className="container px-4 md:px-6 py-8 max-w-6xl mx-auto">
      {!isStudying ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-8">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Practice Session</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Test your knowledge and improve your learning with a practice session.
            </p>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Category
              </label>
              <Select
                value={selectedCategory || "all"}
                onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {Object.keys(answeredCards).length > 0 ? (
              <ResultsCard 
                results={results}
                total={Object.keys(answeredCards).length}
                onRestartSession={startStudySession}
              />
            ) : (
              <Button 
                onClick={startStudySession}
                className="bg-orange-500 hover:bg-orange-600 w-full"
                disabled={flashcards.length === 0}
              >
                Start Practice Session
              </Button>
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

          {studyCards.length > 0 && currentCardIndex < studyCards.length ? (
            <StudyCard
              flashcard={studyCards[currentCardIndex]}
              onAnswer={handleAnswer}
              onFinish={finishSession}
              isLastCard={currentCardIndex === studyCards.length - 1}
            />
          ) : (
            <ResultsCard 
              results={results}
              total={Object.keys(answeredCards).length}
              onRestartSession={startStudySession}
            />
          )}
        </div>
      )}
    </div>
  );
}