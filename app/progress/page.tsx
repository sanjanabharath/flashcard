"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import ProgressStats from "@/components/progress/progress-stats";
import CategoryPerformance from "@/components/progress/category-performance";
import { Flashcard, Category, StudySession } from "@/lib/types";
import { loadFlashcards, loadCategories, loadStudySessions } from "@/lib/storage";
import { format, subDays } from "date-fns";

export default function ProgressPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const storedFlashcards = loadFlashcards();
    const storedCategories = loadCategories();
    const storedStudySessions = loadStudySessions();
    
    setFlashcards(storedFlashcards);
    setCategories(storedCategories);
    setStudySessions(storedStudySessions);
  }, []);

  // Generate data for charts
  const generateDailyActivityData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return {
        date: format(date, "MMM dd"),
        fullDate: date,
        cardsStudied: 0,
      };
    }).reverse();
    
    studySessions.forEach(session => {
      const sessionDate = new Date(session.date);
      const dayIndex = last7Days.findIndex(day => 
        format(day.fullDate, "yyyy-MM-dd") === format(sessionDate, "yyyy-MM-dd")
      );
      
      if (dayIndex !== -1) {
        last7Days[dayIndex].cardsStudied += session.cardsStudied;
      }
    });
    
    return last7Days.map(day => ({
      date: day.date,
      cardsStudied: day.cardsStudied,
    }));
  };

  const calculateSessionScores = () => {
    return studySessions.map(session => ({
      date: format(new Date(session.date), "MMM dd"),
      score: Math.round((session.correctCount / session.cardsStudied) * 100) || 0,
    })).slice(-10);
  };

  const calculateCategoryBreakdown = () => {
    const categoryCounts: Record<string, number> = {};
    
    flashcards.forEach(card => {
      const categoryId = card.categoryId || "uncategorized";
      categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
    });
    
    return Object.entries(categoryCounts).map(([categoryId, count]) => {
      const categoryName = categoryId === "uncategorized" 
        ? "Uncategorized" 
        : categories.find(c => c.id === categoryId)?.name || "Unknown";
      
      return {
        name: categoryName,
        value: count,
      };
    });
  };

  // Charts data
  const dailyActivityData = generateDailyActivityData();
  const sessionScoresData = calculateSessionScores();
  const categoryBreakdownData = calculateCategoryBreakdown();

  const COLORS = ["#FF7A00", "#1E3A8A", "#10B981", "#F59E0B", "#EC4899"];

  return (
    <div className="container px-4 md:px-6 py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Your Progress
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your learning journey and see your improvement over time.
        </p>
      </div>

      <Tabs 
        defaultValue={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
          <TabsTrigger value="performance" className="flex-1">Performance</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProgressStats 
              totalCards={flashcards.length}
              totalCategories={categories.length}
              studySessionsCount={studySessions.length}
              averageScore={studySessions.length > 0 
                ? Math.round(studySessions.reduce((sum, session) => 
                    sum + (session.correctCount / session.cardsStudied * 100), 0) / studySessions.length) 
                : 0
              }
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity</CardTitle>
                <CardDescription>Cards studied in the last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value} cards`, 'Studied']}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0' 
                      }}
                    />
                    <Bar dataKey="cardsStudied" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress Trend</CardTitle>
                <CardDescription>Your recent session scores</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sessionScoresData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, 'Score']}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0' 
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2} 
                      dot={{ r: 4 }} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Distribution of your flashcards by category</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value} cards`, 'Count']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <CategoryPerformance 
            flashcards={flashcards}
            categories={categories}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Study history will be implemented here */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Study Sessions</CardTitle>
              <CardDescription>Your learning activity history</CardDescription>
            </CardHeader>
            <CardContent>
              {studySessions.length === 0 ? (
                <p className="text-center py-8 text-gray-500">
                  You haven't completed any study sessions yet. Start practicing to see your history!
                </p>
              ) : (
                <div className="space-y-4">
                  {studySessions.slice().reverse().map((session) => {
                    const categoryName = session.categoryId 
                      ? categories.find(c => c.id === session.categoryId)?.name || "Unknown" 
                      : "All Categories";
                    
                    const score = Math.round((session.correctCount / session.cardsStudied) * 100);
                    
                    return (
                      <div 
                        key={session.id} 
                        className="p-4 border rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{format(new Date(session.date), "MMM dd, yyyy")}</p>
                          <p className="text-sm text-gray-500">{categoryName}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            score >= 70 ? 'text-green-600' : score >= 50 ? 'text-orange-500' : 'text-red-600'
                          }`}>
                            {score}%
                          </p>
                          <p className="text-sm text-gray-500">
                            {session.correctCount} of {session.cardsStudied} correct
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}