import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-orange-500" />
          <span className="text-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            FlashLearn
          </span>
        </div>
        <div className="text-center text-sm text-muted-foreground md:text-right">
          <p>© 2025 FlashLearn. All rights reserved.</p>
          <p className="mt-1">
            Helping students learn smarter, not harder.
          </p>
        </div>
      </div>
    </footer>
  );
}