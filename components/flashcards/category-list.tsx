import { Button } from "@/components/ui/button";
import { Category } from "@/lib/types";
import { BookOpen, Plus } from "lucide-react";
import { useState } from "react";
import CreateCategoryDialog from "./create-category-dialog";
import { useToast } from "@/hooks/use-toast";

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onAddCategory?: (category: Category) => void;
}

export default function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
}: CategoryListProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateCategory = (category: Category) => {
    if (onAddCategory) {
      onAddCategory(category);
      
      toast({
        title: "Category created",
        description: "Your new category has been created successfully.",
      });
    }
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="space-y-1">
      <Button
        variant={selectedCategory === null ? "secondary" : "ghost"}
        className="w-full justify-start"
        onClick={() => onSelectCategory(null)}
      >
        <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
        All Subjects
      </Button>
      
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onSelectCategory(category.id)}
        >
          <div
            className="h-3 w-3 rounded-full mr-2"
            style={{ backgroundColor: category.color }}
          />
          {category.name}
        </Button>
      ))}
      
      <Button 
        variant="outline" 
        className="w-full mt-4"
        onClick={() => setIsCreateDialogOpen(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Category
      </Button>

      <CreateCategoryDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSave={handleCreateCategory}
      />
    </div>
  );
}