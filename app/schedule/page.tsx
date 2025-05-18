'use client'

import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Clock, BookOpen, Repeat, Save, Trash2, Plus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "react-hot-toast";

const PREDEFINED_SCHEDULES = {
  beginner: [1, 3, 7, 14],
  intermediate: [1, 3, 7, 14, 30],
  advanced: [1, 2, 4, 8, 15, 30],
  custom: []
};

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("15:00");
  const [flashcards, setFlashcards] = useState([]);
  const [newFlashcard, setNewFlashcard] = useState("");
  const [repetitionSchedule, setRepetitionSchedule] = useState("intermediate");
  const [customDays, setCustomDays] = useState([]);
  const [newDay, setNewDay] = useState("");
  const [notes, setNotes] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState([]);
  const [duration, setDuration] = useState("30");
  const [difficulty, setDifficulty] = useState("medium");
  const [category, setCategory] = useState("");
  const [reminder, setReminder] = useState("10");

  const daysOfWeek = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' }
  ];

  const timeSlots = [...Array(24)].map((_, hour) => {
    const hourStr = hour.toString().padStart(2, "0");
    return [
      { value: `${hourStr}:00`, label: `${hourStr}:00` },
      { value: `${hourStr}:30`, label: `${hourStr}:30` }
    ];
  }).flat();

  const handleAddFlashcard = () => {
    if (newFlashcard.trim()) {
      const flashcard = {
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

  const handleRemoveFlashcard = (id) => {
    setFlashcards(flashcards.filter(fc => fc.id !== id));
  };

  const handleAddCustomDay = () => {
    const day = parseInt(newDay);
    if (day && day > 0 && !customDays.includes(day)) {
      setCustomDays([...customDays, day].sort((a, b) => a - b));
      setNewDay("");
    }
  };

  const handleRemoveCustomDay = (day) => {
    setCustomDays(customDays.filter(d => d !== day));
  };

  const toggleRecurringDay = (day) => {
    setRecurringDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const getRepetitionDays = () => {
    if (repetitionSchedule === 'custom') {
      return customDays;
    }
    return PREDEFINED_SCHEDULES[repetitionSchedule];
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'easy': 
        return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700';
      case 'medium': 
        return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
      case 'hard': 
        return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700';
      default: 
        return 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const handleSchedule = () => {
    const schedule = {
      date: selectedDate,
      time: selectedTime,
      flashcards: flashcards,
      repetitionDays: getRepetitionDays(),
      notes,
      isRecurring,
      recurringDays,
      duration: parseInt(duration),
      reminder: parseInt(reminder)
    };
    
    console.log('Schedule created:', schedule);
    toast.success(
      <div className="flex items-center gap-2">
        <Check className="w-5 h-5 text-green-500" />
        <span>Schedule created successfully!</span>
      </div>
    );
  };

  const handleSaveDraft = () => {
    // Save draft logic here
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

  const isFormValid = () => {
    return selectedDate && selectedTime && flashcards.length > 0;
  };

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Schedule Flashcard Study</h1>
          <p className="text-gray-600">Plan your spaced repetition learning sessions</p>
        </div>
        <Button variant="outline" onClick={() => window.location.href = "/flashcards"}>
          <BookOpen className="mr-2 h-4 w-4" />
          View All Flashcards
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Date & Time Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Date & Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Study Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border mt-2"
                disabled={(date) => date < new Date()}
              />
            </div>

            <div>
              <Label>Start Time</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Duration (minutes)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Reminder</Label>
              <Select value={reminder} onValueChange={setReminder}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes before</SelectItem>
                  <SelectItem value="10">10 minutes before</SelectItem>
                  <SelectItem value="15">15 minutes before</SelectItem>
                  <SelectItem value="30">30 minutes before</SelectItem>
                  <SelectItem value="60">1 hour before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Flashcard Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Flashcards ({flashcards.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Add New Flashcard</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Flashcard topic"
                  value={newFlashcard}
                  onChange={(e) => setNewFlashcard(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFlashcard()}
                />
                <Button onClick={handleAddFlashcard} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Category</Label>
                <Input
                  placeholder="e.g., Math, Science"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div>
                <Label>Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div>
              <Label>Selected Flashcards</Label>
              <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                {flashcards.length === 0 ? (
                  <p className="text-gray-500 text-sm">No flashcards selected</p>
                ) : (
                  flashcards.map((flashcard) => (
                    <div key={flashcard.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100">{flashcard.name}</div>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-gray-900 dark:text-gray-100 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                            {flashcard.category}
                          </Badge>
                          <Badge 
                            className={`text-gray-900 dark:text-gray-100 ${getDifficultyColor(flashcard.difficulty)}`}
                          >
                            {flashcard.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => handleRemoveFlashcard(flashcard.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Repeat className="h-5 w-5" />
              Schedule Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Spaced Repetition Schedule</Label>
              <Select value={repetitionSchedule} onValueChange={setRepetitionSchedule}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner (1, 3, 7, 14 days)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (1, 3, 7, 14, 30 days)</SelectItem>
                  <SelectItem value="advanced">Advanced (1, 2, 4, 8, 15, 30 days)</SelectItem>
                  <SelectItem value="custom">Custom Schedule</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {repetitionSchedule === 'custom' && (
              <div>
                <Label>Custom Repetition Days</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="number"
                    placeholder="Days"
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCustomDay()}
                  />
                  <Button onClick={handleAddCustomDay} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {customDays.map((day) => (
                    <Badge key={day} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveCustomDay(day)}>
                      {day} days <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <Label>Recurring Session</Label>
              <Switch
                checked={isRecurring}
                onCheckedChange={setIsRecurring}
              />
            </div>

            {isRecurring && (
              <div>
                <Label>Repeat on Days</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {daysOfWeek.map((day) => (
                    <Button
                      key={day.key}
                      variant={recurringDays.includes(day.key) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleRecurringDay(day.key)}
                    >
                      {day.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label>Notes</Label>
              <Textarea
                placeholder="Add any notes about your study session..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Summary */}
      {isFormValid() && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Schedule Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-medium">Date & Time</div>
                  <div className="text-sm text-gray-600">
                    {format(selectedDate, 'PPP')} at {selectedTime}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">Flashcards</div>
                  <div className="text-sm text-gray-600">
                    {flashcards.length} card(s) selected
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="font-medium">Duration</div>
                  <div className="text-sm text-gray-600">
                    {duration} minutes
                  </div>
                </div>
              </div>
            </div>
            {isRecurring && recurringDays.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-800">Recurring Schedule</div>
                <div className="text-sm text-blue-600">
                  Every {recurringDays.join(', ')} at {selectedTime}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex justify-between">
        <Button 
          variant="outline"
          onClick={handleSaveDraft}
        >
          <Save className="mr-2 h-4 w-4" />
          Save as Draft
        </Button>
        <Button 
          onClick={handleSchedule} 
          size="lg"
          disabled={!isFormValid()}
        >
          Schedule Study Session
        </Button>
      </div>
    </div>
  );
}