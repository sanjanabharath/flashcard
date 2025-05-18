"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, FolderOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import FlashcardList from "@/components/flashcards/flashcard-list";
import CreateFlashcardDialog from "@/components/flashcards/create-flashcard-dialog";
import CategoryList from "@/components/flashcards/category-list";
import { Flashcard, Category } from "@/lib/types";
import { loadFlashcards, loadCategories } from "@/lib/storage";

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedFlashcards = loadFlashcards();
    const storedCategories = loadCategories();
    setFlashcards(storedFlashcards);
    setCategories(storedCategories);
  }, []);

  const filteredFlashcards = flashcards.filter(card => {
    const matchesSearch = card.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         card.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? card.categoryId === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleCreateFlashcard = (newFlashcard: Flashcard) => {
    const updatedFlashcards = [...flashcards, newFlashcard];
    setFlashcards(updatedFlashcards);
    localStorage.setItem('flashcards', JSON.stringify(updatedFlashcards));
    
    toast({
      title: "Flashcard created",
      description: "Your flashcard has been successfully created.",
    });
    
    setIsCreateDialogOpen(false);
  };

  const handleDeleteFlashcard = (id: string) => {
    const updatedFlashcards = flashcards.filter(card => card.id !== id);
    setFlashcards(updatedFlashcards);
    localStorage.setItem('flashcards', JSON.stringify(updatedFlashcards));
    
    toast({
      title: "Flashcard deleted",
      description: "Your flashcard has been successfully deleted.",
    });
  };

  const handleAddCategory = (newCategory: Category) => {
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
  };

  return (
    <div className="container px-4 md:px-6 py-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Flashcards</h1>
          <p className="text-gray-600 dark:text-gray-300">Create and manage your study materials</p>
        </div>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Flashcard
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <div className="mb-6">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Categories</h3>
              <CategoryList 
                categories={categories} 
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onAddCategory={handleAddCategory}
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search flashcards..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Cards</TabsTrigger>
              <TabsTrigger value="recent">Recently Added</TabsTrigger>
              <TabsTrigger value="starred">Starred</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              {filteredFlashcards.length > 0 ? (
                <FlashcardList 
                  flashcards={filteredFlashcards} 
                  categories={categories}
                  onDelete={handleDeleteFlashcard}
                  onStarToggle={(id, isStarred) => {
                    setFlashcards(prev => 
                      prev.map(card => 
                        card.id === id ? { ...card, isStarred } : card
                      )
                    );
                  }}
                />
              ) : (
                <div className="text-center py-12 border rounded-lg bg-gray-50 dark:bg-gray-900">
                  <FolderOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No flashcards found</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {searchQuery || selectedCategory 
                      ? "Try changing your search or category filter" 
                      : "Create your first flashcard to get started"}
                  </p>
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Flashcard
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recent" className="mt-0">
              <FlashcardList 
                flashcards={filteredFlashcards.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())} 
                categories={categories}
                onDelete={handleDeleteFlashcard}
              />
            </TabsContent>

            <TabsContent value="starred" className="mt-0">
              <FlashcardList 
                flashcards={filteredFlashcards.filter(card => card.isStarred)} 
                categories={categories}
                onDelete={handleDeleteFlashcard}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CreateFlashcardDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
        onSave={handleCreateFlashcard}
        categories={categories}
      />
    </div>
  );
}