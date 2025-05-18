import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, BarChart2, Plus, ArrowRight } from "lucide-react";
import HeroCard from "@/components/home/hero-card";
import FeatureCard from "@/components/home/feature-card";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Animated Background Scribbles */}
      <div className="scribble scribble-1" />
      <div className="scribble scribble-2" />
      <div className="scribble scribble-3" />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 dark:from-orange-950 dark:via-orange-900 dark:to-orange-950">
        <div className="absolute inset-0 bg-[url(/grid-pattern.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent animate-fade-in">
              Master Any Subject with FlashLearn
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-[700px] mx-auto animate-fade-in-up">
              Create interactive flashcards, practice efficiently, and track your progress with beautiful visualizations.
            </p>
            <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up delay-200">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
                <Link href="/flashcards">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/practice">Try Demo</Link>
              </Button>
            </div>
          </div>
          
          {/* Animated hero card */}
          <div className="mt-12 flex items-center justify-center">
            <div className="w-full max-w-md">
              <HeroCard />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Supercharge Your Learning
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<BookOpen className="h-10 w-10 text-orange-500" />}
                title="Create Custom Flashcards"
                description="Build your personal study collection with easy-to-create digital flashcards for any subject."
              />
              <FeatureCard 
                icon={<Plus className="h-10 w-10 text-orange-500" />}
                title="Practice Effectively"
                description="Study smarter with our adaptive learning system that focuses on what you need to review most."
              />
              <FeatureCard 
                icon={<BarChart2 className="h-10 w-10 text-orange-500" />}
                title="Track Your Progress"
                description="Visualize your improvement with beautiful charts and detailed statistics on your learning journey."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-orange-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <p className="text-lg text-gray-600 dark:text-gray-300 italic">
                      "FlashLearn helped me ace my finals. The progress tracking kept me motivated throughout the semester!"
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-orange-200 w-12 h-12 flex items-center justify-center">
                        <span className="text-orange-600 font-semibold">AS</span>
                      </div>
                      <div>
                        <p className="font-medium">Alex Smith</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Biology Student</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <p className="text-lg text-gray-600 dark:text-gray-300 italic">
                      "The analytics showing my weak areas helped me focus my study time where I needed it most. Game changer!"
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-orange-200 w-12 h-12 flex items-center justify-center">
                        <span className="text-orange-600 font-semibold">JL</span>
                      </div>
                      <div>
                        <p className="font-medium">Jamie Lee</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Chemistry Major</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start Your Learning Journey Today
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of students who are learning more effectively with FlashLearn.
            </p>
            <div className="flex justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                <Link href="/flashcards">
                  Create Your First Flashcard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}