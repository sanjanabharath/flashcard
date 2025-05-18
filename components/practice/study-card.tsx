"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, RefreshCw, ChevronRight } from "lucide-react";
import { Flashcard } from "@/lib/types";

interface StudyCardProps {
  flashcard: Flashcard;
  onAnswer: (id: string, isCorrect: boolean) => void;
  onFinish: () => void;
  isLastCard: boolean;
  onNext: () => void;
}

export default function StudyCard({ 
  flashcard, 
  onAnswer,
  onFinish,
  isLastCard,
  onNext
}: StudyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<boolean | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleFlip = () => {
    if (!answered && !isTransitioning) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    setAnswered(true);
    setLastAnswer(isCorrect);
    onAnswer(flashcard.id, isCorrect);
  };

  const handleNext = () => {
    if (isLastCard) {
      onFinish();
    } else {
      // Reset the card state before moving to next
      setIsFlipped(false);
      setAnswered(false);
      setLastAnswer(null);
      setIsTransitioning(true);
      
      // Use a timeout to ensure the transition completes
      setTimeout(() => {
        onNext();
        setIsTransitioning(false);
      }, 600);
    }
  };

  // Reset states when flashcard changes
  React.useEffect(() => {
    // Prevent resetting if we're in the middle of a transition
    if (isTransitioning) return;

    setIsFlipped(false);
    setAnswered(false);
    setLastAnswer(null);
    setIsTransitioning(false);
  }, [flashcard.id]);

  return (
    <div className="w-full perspective-1000 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={flashcard.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                style={{ position: 'relative' }}
                className="w-full"
              >      <motion.div
            key={flashcard.id}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ 
              transformStyle: "preserve-3d",
              perspective: "1000px"
            }}
            className="relative w-full preserve-3d"
          >
            {/* Front */}
            <Card 
              className={`w-full p-6 ${isFlipped ? "backface-hidden absolute" : ""} border-2 border-orange-200 dark:border-orange-800 shadow-lg cursor-pointer`}
              onClick={handleFlip}
              style={{ 
                transition: "transform 0.6s ease-in-out",
                backfaceVisibility: "hidden"
              }}
            >
              <CardContent className="p-0">
                <div className="min-h-[200px] flex items-center justify-center mb-4">
                  <p className="text-xl font-medium text-center">
                    {flashcard.question}
                  </p>
                </div>
                <div className="text-center text-sm text-muted-foreground flex items-center justify-center">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Tap to flip
                </div>
              </CardContent>
            </Card>

            {/* Back */}
            <Card 
              className={`w-full p-6 ${isFlipped ? "" : "backface-hidden absolute"} border-2 border-orange-300 dark:border-orange-700 shadow-lg bg-orange-50 dark:bg-orange-900`}
              style={{ 
                transform: "rotateY(180deg)",
                transition: "transform 0.6s ease-in-out",
                backfaceVisibility: "hidden"
              }}
            >
              <CardContent className="p-0">
                <div className="min-h-[200px] flex items-center justify-center mb-8">
                  <p className="text-xl font-medium text-center text-orange-700 dark:text-orange-300">
                    {flashcard.answer}
                  </p>
                </div>
                
                {!answered ? (
                  <div className="flex justify-center gap-4">
                    <Button 
                      onClick={() => handleAnswer(false)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Incorrect
                    </Button>
                    <Button 
                      onClick={() => handleAnswer(true)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Correct
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Show feedback based on the actual answer */}
                    <div className="flex justify-center mb-6">
                      {lastAnswer ? (
                        <div className="text-center">
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                          </div>
                          <p className="text-lg font-medium text-green-700 dark:text-green-300">
                            Correct!
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-2">
                            <X className="w-6 h-6 text-red-600 dark:text-red-400" />
                          </div>
                          <p className="text-lg font-medium text-red-700 dark:text-red-300">
                            Incorrect
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-center">
                      <Button 
                        onClick={handleNext}
                        className="bg-orange-500 hover:bg-orange-600"
                        disabled={isTransitioning}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {isLastCard ? (
                          <>
                            Finish Session
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </>
                        ) : (
                          <>
                            Next Question
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="text-sm text-center text-muted-foreground">
                      {isLastCard ? "Great job! You've completed the session." : "Click Next Question to continue"}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}