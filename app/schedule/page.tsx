'use client';

import { Calendar } from "@/components/ui/calendar";
import {
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  Repeat,
  Save,
  Trash2,
  Plus,
  X,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "react-hot-toast";

type Flashcard = {
  id: number;
  name: string;
  category: string;
  difficulty: string;
  dateAdded: Date;
};

const PREDEFINED_SCHEDULES: Record<string, number[]> = {
  beginner: [1, 3, 7, 14],
  intermediate: [1, 3, 7, 14, 30],
  advanced: [1, 2, 4, 8, 15, 30],
  custom: []
};

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState("15:00");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [newFlashcard, setNewFlashcard] = useState("");
  const [repetitionSchedule, setRepetitionSchedule] = useState("intermediate");
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [newDay, setNewDay] = useState("");
  const [notes, setNotes] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState<string[]>([]);
  const [duration, setDuration] = useState("30");
  const [difficulty, setDifficulty] = useState("medium");
  const [category, setCategory] = useState("");
  const [reminder, setReminder] = useState("10");

  const daysOfWeek = [
    { key: "monday", label: "Mon" },
    { key: "tuesday", label: "Tue" },
    { key: "wednesday", label: "Wed" },
    { key: "thursday", label: "Thu" },
    { key: "friday", label: "Fri" },
    { key: "saturday", label: "Sat" },
    { key: "sunday", label: "Sun" }
  ];

  const timeSlots = [...Array(24)].flatMap((_, hour) => {
    const hourStr = hour.toString().padStart(2, "0");
    return [
      { value: `${hourStr}:00`, label: `${hourStr}:00` },
      { value: `${hourStr}:30`, label: `${hourStr}:30` }
    ];
  });

  const handleAddFlashcard = () => {
    if (newFlashcard.trim()) {
      const flashcard: Flashcard = {
        id: Date.now(),
        name: newFlashcard,
        category: category || "General",
        difficulty,
        dateAdded: new Date()
      };
      setFlashcards([...flashcards, flashcard]);
      setNewFlashcard("");
    }
  };

  const handleRemoveFlashcard = (id: number) => {
    setFlashcards(flashcards.filter((fc) => fc.id !== id));
  };

  const handleAddCustomDay = () => {
    const day = parseInt(newDay);
    if (day && day > 0 && !customDays.includes(day)) {
      setCustomDays([...customDays, day].sort((a, b) => a - b));
      setNewDay("");
    }
  };

  const handleRemoveCustomDay = (day: number) => {
    setCustomDays(customDays.filter((d) => d !== day));
  };

  const toggleRecurringDay = (day: string) => {
    setRecurringDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const getRepetitionDays = (): number[] => {
    return repetitionSchedule === "custom"
      ? customDays
      : PREDEFINED_SCHEDULES[repetitionSchedule];
  };

  const getDifficultyColor = (diff: string): string => {
    switch (diff) {
      case "easy":
        return "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700";
      case "medium":
        return "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700";
      case "hard":
        return "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700";
      default:
        return "bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  const handleSchedule = () => {
    if (!selectedDate) return;
    const schedule = {
      date: selectedDate,
      time: selectedTime,
      flashcards,
      repetitionDays: getRepetitionDays(),
      notes,
      isRecurring,
      recurringDays,
      duration: parseInt(duration),
      reminder: parseInt(reminder)
    };

    console.log("Schedule created:", schedule);
    toast.success(
      <div className="flex items-center gap-2">
        <Check className="w-5 h-5 text-green-500" />
        <span>Schedule created successfully!</span>
      </div>
    );
  };

  const handleSaveDraft = () => {
    // Simulate draft saving
    toast(
      <div className="flex items-center gap-2">
        <Save className="w-5 h-5 text-yellow-500" />
        <span>Draft saved successfully!</span>
      </div>,
      {
        icon: <Save className="w-5 h-5 text-yellow-500" />,
        duration: 3000,
        position: "top-right"
      }
    );
  };

  const isFormValid = (): boolean => {
    return !!selectedDate && !!selectedTime && flashcards.length > 0;
  };

  return (
    <div className="mt-6">
      {/* ... all the JSX you already have ... */}
      <Separator className="my-4" />
      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" onClick={handleSaveDraft}>
          <Save className="mr-2 h-4 w-4" />
          Save as Draft
        </Button>
        <Button
          onClick={handleSchedule}
          disabled={!isFormValid()}
          className="bg-primary text-white"
        >
          <Check className="mr-2 h-4 w-4" />
          Create Schedule
        </Button>
      </div>
    </div>
  );
}
