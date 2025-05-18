import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CustomProgress } from "@/components/ui/custom-progress";
import { Flashcard, Category } from "@/lib/types";

// Helper function to format percentage
const formatPercentage = (value: number) => {
  return Math.round(value);
};

interface CategoryPerformanceProps {
  flashcards: Flashcard[];
  categories: Category[];
}

export default function CategoryPerformance({
  flashcards,
  categories,
}: CategoryPerformanceProps) {
  // Calculate performance by category
  const categoryPerformance = categories.map(category => {
    const categoryCards = flashcards.filter(card => card.categoryId === category.id);
    
    // Skip if no cards in this category
    if (categoryCards.length === 0) {
      return {
        id: category.id,
        name: category.name,
        color: category.color,
        totalCards: 0,
        correctRate: 0,
        practicedCards: 0,
        needsReviewCount: 0
      };
    }

    const totalAttempts = categoryCards.reduce((sum, card) => 
      sum + (card.correctCount + card.incorrectCount), 0);
    
    const totalCorrect = categoryCards.reduce((sum, card) => 
      sum + card.correctCount, 0);
    
    const practicedCards = categoryCards.filter(card => 
      card.lastPracticed !== null).length;
    
    // Consider cards with < 70% correct rate as needing review
    const needsReviewCount = categoryCards.filter(card => {
      const total = card.correctCount + card.incorrectCount;
      return total > 0 && (card.correctCount / total) < 0.7;
    }).length;

    return {
      id: category.id,
      name: category.name,
      color: category.color,
      totalCards: categoryCards.length,
      correctRate: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
      practicedCards,
      needsReviewCount
    };
  });

  // Handle uncategorized cards
  const uncategorizedCards = flashcards.filter(card => card.categoryId === null);
  
  if (uncategorizedCards.length > 0) {
    const totalAttempts = uncategorizedCards.reduce((sum, card) => 
      sum + (card.correctCount + card.incorrectCount), 0);
    
    const totalCorrect = uncategorizedCards.reduce((sum, card) => 
      sum + card.correctCount, 0);
    
    const practicedCards = uncategorizedCards.filter(card => 
      card.lastPracticed !== null).length;
    
    const needsReviewCount = uncategorizedCards.filter(card => {
      const total = card.correctCount + card.incorrectCount;
      return total > 0 && (card.correctCount / total) < 0.7;
    }).length;

    categoryPerformance.push({
      id: "uncategorized",
      name: "Uncategorized",
      color: "#64748b", // slate color for uncategorized
      totalCards: uncategorizedCards.length,
      correctRate: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
      practicedCards,
      needsReviewCount
    });
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-orange-500 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Category Performance</h2>
      
      {categoryPerformance.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">
              No categories found. Create flashcards with categories to see performance metrics.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {categoryPerformance.map((category) => (
            <Card key={category.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <CardTitle>{category.name}</CardTitle>
                  </div>
                  <div className={`text-xl font-bold ${getScoreColor(category.correctRate)}`}>
                    {category.correctRate}%
                  </div>
                </div>
                <CardDescription>
                  {category.totalCards} cards · {category.practicedCards} practiced
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Accuracy</span>
                      <span>{formatPercentage(category.correctRate)}%</span>
                    </div>
                    <CustomProgress
                      value={formatPercentage(category.correctRate)}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Coverage</p>
                      <p className="text-lg font-semibold">
                        {category.totalCards > 0 
                          ? Math.round((category.practicedCards / category.totalCards) * 100)
                          : 0}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {category.practicedCards} of {category.totalCards} cards practiced
                      </p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Needs Review</p>
                      <p className="text-lg font-semibold">
                        {category.needsReviewCount} 
                      </p>
                      <p className="text-xs text-gray-500">
                        Cards below 70% accuracy
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}