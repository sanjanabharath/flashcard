"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MoreHorizontal, 
  Star, 
  Trash, 
  Pencil,
  RefreshCw
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { Flashcard, Category } from "@/lib/types";

interface FlashcardListProps {
  flashcards: Flashcard[];
  categories: Category[];
  onDelete: (id: string) => void;
}

export default function FlashcardList({ 
  flashcards, 
  categories,
  onDelete 
}: FlashcardListProps) {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  
  const toggleFlip = (id: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleStar = (id: string) => {
    const storedFlashcards = JSON.parse(localStorage.getItem('flashcards') || '[]');
    const updatedFlashcards = storedFlashcards.map((card: Flashcard) => 
      card.id === id ? { ...card, isStarred: !card.isStarred } : card
    );
    localStorage.setItem('flashcards', JSON.stringify(updatedFlashcards));
    window.location.reload(); // Refresh to see changes - in a real app would use state management
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {flashcards.map((flashcard) => (
        <div key={flashcard.id} className="perspective-1000">
          <motion.div
            animate={{ rotateY: flippedCards[flashcard.id] ? 180 : 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative w-full h-full preserve-3d cursor-pointer"
          >
            {/* Card Front */}
            <Card 
              className={`w-full ${
                flippedCards[flashcard.id] ? "backface-hidden absolute" : ""
              } border-2 hover:border-orange-300 transition-colors duration-200`}
              onClick={() => toggleFlip(flashcard.id)}
            >
              <CardHeader className="pb-2 flex flex-row justify-between items-start">
                <Badge 
                  variant="outline" 
                  className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 mb-2"
                >
                  {getCategoryName(flashcard.categoryId)}
                </Badge>
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-orange-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(flashcard.id);
                    }}
                  >
                    <Star 
                      className={`h-4 w-4 ${flashcard.isStarred ? "fill-orange-500" : ""}`}
                    />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(flashcard.id);
                        }}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="min-h-[100px] flex items-center justify-center">
                  <p className="text-lg font-medium text-center">
                    {flashcard.question}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-0 text-xs text-gray-500">
                <span>Created: {new Date(flashcard.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Tap to flip
                </span>
              </CardFooter>
            </Card>

            {/* Card Back */}
            <Card 
              className={`w-full ${
                flippedCards[flashcard.id] ? "" : "backface-hidden absolute"
              } border-2 hover:border-orange-300 transition-colors duration-200 bg-orange-50 dark:bg-orange-900`}
              onClick={() => toggleFlip(flashcard.id)}
              style={{ transform: "rotateY(180deg)" }}
            >
              <CardHeader className="pb-2 flex flex-row justify-between items-start">
                <Badge 
                  variant="outline" 
                  className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 mb-2"
                >
                  Answer
                </Badge>
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-orange-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(flashcard.id);
                    }}
                  >
                    <Star 
                      className={`h-4 w-4 ${flashcard.isStarred ? "fill-orange-500" : ""}`}
                    />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(flashcard.id);
                        }}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="min-h-[100px] flex items-center justify-center">
                  <p className="text-lg font-medium text-center text-orange-700 dark:text-orange-300">
                    {flashcard.answer}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-0 text-xs text-gray-500">
                <span>Last practiced: {flashcard.lastPracticed ? new Date(flashcard.lastPracticed).toLocaleDateString() : 'Never'}</span>
                <span className="flex items-center">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Tap to flip
                </span>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      ))}
    </div>
  );
}