"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Repeat, RefreshCw, ChevronRight } from "lucide-react";
import { Flashcard } from "@/lib/types";

interface StudyCardProps {
  flashcard: Flashcard;
  onAnswer: (id: string, isCorrect: boolean) => void;
  onFinish: () => void;
  isLastCard: boolean;
}

export default function StudyCard({ 
  flashcard, 
  onAnswer,
  onFinish,
  isLastCard
}: StudyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);
  
  const handleFlip = () => {
    if (!answered) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    setAnswered(true);
    onAnswer(flashcard.id, isCorrect);
  };

  const handleNext = () => {
    if (isLastCard) {
      onFinish();
    } else {
      setIsFlipped(false);
      setAnswered(false);
    }
  };

  return (
    <div className="w-full perspective-1000">
      <AnimatePresence mode="wait">
        <motion.div
          key={flashcard.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative w-full preserve-3d"
          >
            {/* Card Front */}
            <Card 
              className={`w-full p-6 ${
                isFlipped ? "backface-hidden absolute" : ""
              } border-2 border-orange-200 dark:border-orange-800 shadow-lg cursor-pointer`}
              onClick={handleFlip}
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

            {/* Card Back */}
            <Card 
              className={`w-full p-6 ${
                isFlipped ? "" : "backface-hidden absolute"
              } border-2 border-orange-300 dark:border-orange-700 shadow-lg bg-orange-50 dark:bg-orange-900`}
              onClick={answered ? undefined : handleFlip}
              style={{ transform: "rotateY(180deg)" }}
            >
              <CardContent className="p-0">
                <div className="min-h-[200px] flex items-center justify-center mb-6">
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
                  <div className="flex justify-center">
                    <Button 
                      onClick={handleNext}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      {isLastCard ? (
                        <>
                          Finish
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Next Card
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
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